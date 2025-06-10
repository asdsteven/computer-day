class Controller {
    constructor(scene) {
        this.scene = scene;
        this.interrupts = {};

        this.viewWidth = worldWidth / 3;
        this.viewHeight = worldHeight / 3;
        const c = this.scene.cameras.main;
        c.setBounds(0, 0, worldWidth, worldHeight);
        this.grass = [];
        this.drawGrass();
        const zoom = () => {
            if (c.width / c.height > worldWidth / this.viewHeight) {
                // very wide
                c.setZoom(c.width / worldWidth);
            } else if (c.height / c.width > worldHeight / this.viewWidth) {
                // very tall
                c.setZoom(c.height / worldHeight);
            } else if (c.width / c.height > this.viewWidth / this.viewHeight) {
                // wide
                c.setZoom(c.height / this.viewHeight);
            } else {
                // tall
                c.setZoom(c.width / this.viewWidth);
            }
        };
        this.initZoom = () => {
            zoom();
            c.centerOn(worldWidth / 2, worldHeight / 2);
        };
        this.scene.scale.on('resize', () => {
            const centerX = c.midPoint.x;
            const centerY = c.midPoint.y;
            zoom();
            c.centerOn(centerX, centerY);
        });
    }

    async delay(ms) {
        await new Promise(resolve => {
            this.scene.time.delayedCall(ms, resolve);
        });
    }

    setupInterrupts(...events) {
        return new Promise(resolve => {
            this.interrupts = Object.fromEntries(events.map(e => [e, () => {
                resolve(e);
            }]));
        });
    }

    setupSocket() {
        const socket = io();
        const playerOn = (event, listener) => socket.on(event, async (level, id, ...args) => {
            if (level != this.level) {
                console.log(`socket ${event}: level differ:`, this.level, level);
                this.level = level;
                this.interrupts.level?.();
                return;
            }
            if (!this.players[id]) {
                console.log(`socket ${event}: stranger:`, id);
                const e = await socket.emitWithAck('pardon', id);
                if (!e.ok) {
                    console.log('socket pardon:', e.msg);
                    return;
                }
                if (!this.players[id]) {
                    this.players[id] = new Player(this, e);
                }
            }
            listener(id, ...args);
        });

        socket.on('ready', level => {
            if (level != this.level) {
                console.log(`socket ready: level differ:`, this.level, level);
                this.level = level;
                this.interrupts.level?.();
                return;
            }
        });
        socket.on('level', level => {
            console.log('socket level:', level);
            this.level = level;
            this.interrupts.level?.();
        });
        socket.on('join', (level, id, name, avatar) => {
            if (level != this.level) {
                console.log(`socket join: level differ:`, this.level, level);
                this.level = level;
                this.interrupts.level?.();
                return;
            }
            if (this.players[id]) {
                console.log('socket join: exist:', id, name, lpc[avatar]);
                return;
            }
            console.log('socket join:', name, lpc[avatar]);
            this.players[id] = new Player(this, { name: name, avatar: avatar });
            this.players[id].initLevel(this.level);
        });
        playerOn('leave', id => {
            console.log('socket leave:', this.players[id].name);
            this.players[id].destroy();
            delete this.players[id];
        });
        playerOn('forward', (id, row, col, dir) => {
            this.players[id].row = row;
            this.players[id].col = col;
            this.players[id].dir = dir;
            this.players[id].forward(true);
        });
        playerOn('turn', (id, row, col, dir, ddir) => {
            this.players[id].row = row;
            this.players[id].col = col;
            this.players[id].dir = dir;
            this.players[id].turn(ddir, true);
        });
        playerOn('wander', (id, x, y) => {
            this.players[id].wander(x, y, true);
        });
        return socket;
    }

    async teacherFlow() {
        const room = await this.chooseRoom();
        this.socket = this.setupSocket();
        const e = await this.socket.emitWithAck('teach', room);
        this.level = e.level;
        this.players = Object.fromEntries(Object.entries(e.players).map(([id, p]) => [id, new Player(this, p)]));
        const cleanUp = this.drawTeacherUi();
        while (true) {
            Object.values(this.players).forEach(p => p.initLevel(this.level));
            const cleanUp = this.drawDifficulty();
            const cleanUp2 = this.drawHint();
            const res = await this.drawLevel('level', 'quit');
            cleanUp2();
            cleanUp();
            if (res == 'quit') {
                break;
            }
        }
        cleanUp();
        Object.values(this.players).forEach(p => p.destroy());
        this.socket.disconnect();
        this.socket = null;
    }

    syncLevel(event) {
        return (res, err) => {
            if (err) {
                console.log(`emit ${event} err:`, err);
                return;
            }
            if (res.ok) {
                return;
            }
            if (res.msg != 'level differ') {
                console.log(`emit ${event} err:`, res.msg);
                return;
            }
            this.interrupts.level?.();
        };
    }

    drawTeacherUi() {
        const uiCamera = this.scene.cameras.add(10, 10, 80, 40);
        uiCamera.setBackgroundColor(0xffffff);
        const { add } = this.scene;
        const container = add.container(0, 0);
        let expanded = false;
        const font = {
            fontSize: '16px',
            color: '#000',
            backgroundColor: '#eee',
            padding: { x: 10, y: 10 }
        };
        let y = 40;
        container.add(add.text(0, 0, 'menu', font).setOrigin(0).setInteractive().on('pointerdown', () => {
            if (expanded) {
                expanded = false;
                uiCamera.setViewport(10, 10, 80, 40);
            } else {
                expanded = true;
                uiCamera.setViewport(10, 10, 200, y);
            }
        }));
        container.add(add.text(0, y, 'skip this level', font).setOrigin(0).setInteractive().on('pointerdown', () => {
            this.socket.emit('skip', this.level, this.syncLevel('skip'));
        }));
        y += 40;
        container.add(add.text(0, y, 'stay in level', font).setOrigin(0).setInteractive().on('pointerdown', () => {
            this.socket.emit('stay', this.level, this.syncLevel('stay'));
        }));
        y += 40;
        this.scene.cameras.main.ignore(container);
        return () => {
            container.destroy();
            this.scene.cameras.remove(uiCamera);
        };
    }

    async chooseRoom() {
        return '1A';
    }

    async introductory() {
        this.level = levelBegins[0];
        this.interpreter = new Interpreter(this, 'You', 0);
        const cleanUp = this.drawButton('skip');
        while (true) {
            this.interpreter.initLevel(this.level);
            const cleanUp = this.drawDifficulty();
            const cleanUp2 = this.drawHint();
            const res = await this.drawLevel('solved', 'skip', 'done');
            cleanUp2();
            cleanUp();
            if (res == 'skip') {
                break;
            }
            if (res == 'done') {
                break;
            }
            this.level++;
        }
        cleanUp();
        this.interpreter.destroy();
    }

    drawButton(event) {
        const uiCamera = this.scene.cameras.add(10, 10, 80, 40);
        uiCamera.setBackgroundColor(0xfff);
        const { add } = this.scene;
        const button = add.text(0, 0, event, {
            fontSize: '16px',
            color: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0).setInteractive().on('pointerdown', () => {
            this.interrupts[event]?.();
        });
        this.scene.cameras.main.ignore(button);
        return () => {
            button.destroy();
            this.scene.cameras.remove(uiCamera);
        };
    }

    drawDifficulty() {
        const { roomHeight } = levels[this.level].info;
        const { add } = this.scene;
        const difficulty = [
            'Introductory',
            'Easy',
            'Medium',
            'Difficult'
        ][levels[this.level].difficulty];
        const level = this.level - levelBegins[levels[this.level].difficulty] + 1;
        const text = add.text(worldWidth / 2, (worldHeight - roomHeight) / 2 - tileHeight * 2, `Difficulty: ${difficulty}  Level: ${this.level}`, {
            fontSize: '12px',
            color: '#000',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5, 0).setInteractive().on('pointerdown', () => {
            this.interrupts[event]?.();
        });
        return () => {
            text.destroy();
        };
    }

    drawHint() {
        const hint = levels[this.level].hint;
        if (!hint) {
            return () => {};
        }
        const { roomHeight } = levels[this.level].info;
        const { add } = this.scene;
        const text = add.text(worldWidth / 2, (worldHeight - roomHeight) / 2 - tileHeight, hint, {
            fontSize: '20px',
            color: '#000',
            stroke: '#fff',
            strokeThickness: 4
        }).setOrigin(0.5, 0).setDepth(9999);
        return () => {
            text.destroy();
        };
    }

    async playerFlow() {
        if (await this.chooseMode() == 'single player') {
            await this.chooseDifficulty();
            const avatar = await this.chooseAvatar();
            const name = window.prompt('Enter you name:');
            this.interpreter = new Interpreter(this, name, avatar);
            const cleanUp = this.drawButton('quit');
            while (true) {
                this.interpreter.initLevel(this.level);
                const cleanUp = this.drawDifficulty();
                const cleanUp2 = this.drawHint();
                const res = await this.drawLevel('solved', 'quit', 'done');
                cleanUp2();
                cleanUp();
                if (res == 'quit') {
                    break;
                }
                if (res == 'done') {
                    break;
                }
                this.level++;
            }
            cleanUp();
            this.interpreter.destroy();
            alert('You have completed the challenges!');
            return;
        }
        const avatar = await this.chooseAvatar();
        const name = window.prompt('Enter you name:');
        const room = window.location.pathname.slice(1, 3);
        this.socket = this.setupSocket();
        const e = await this.socket.emitWithAck('join', room, name, avatar);
        if (!e.ok) {
            alert(e.msg);
            return;
        }
        this.level = e.level;
        this.players = Object.fromEntries(Object.entries(e.players).map(([id, p]) => [id, new Player(this, p)]));
        this.interpreter = new Interpreter(this, name, avatar);
        const cleanUp = this.drawButton('quit');
        while (true) {
            this.interpreter.initLevel(this.level);
            Object.values(this.players).forEach(p => p.initLevel(this.level));
            const cleanUp = this.drawDifficulty();
            const cleanUp2 = this.drawHint();
            const res = await this.drawLevel('level', 'quit');
            cleanUp2();
            cleanUp();
            if (res == 'quit') {
                break;
            }
        }
        cleanUp();
        this.interpreter.destroy();
        Object.values(this.players).forEach(p => p.destroy());
        this.socket.disconnect();
        this.socket = null;
    }

    async chooseDifficulty() {
        this.level = levelBegins[1];
    }

    drawGrass() {
        const { add, textures } = this.scene;
        const grass = textures.getFrame('grass', 0);
        for (let y = 0; y < worldHeight; y += grass.height) {
            for (let x = 0; x < worldWidth; x += grass.width) {
                this.grass.push(add.sprite(x, y, 'grass', Phaser.Math.RND.pick([0, 0, 0, 0, 0, 0, 9, 9, 9, 18]))
                                   .setOrigin(0).setDepth(-1));
            }
        }
    }

    redrawGrass() {
        for (const grass of this.grass) {
            grass.setFrame(Phaser.Math.RND.pick([0, 0, 0, 0, 0, 0, 9, 9, 9, 18]));
        }
    }

    async drawLevel(...interrupts) {
        const { tiles, info } = levels[this.level];
        const { roomWidth, roomHeight } = info;
        const { add, textures } = this.scene;
        const wall = textures.get('wall0').getSourceImage();
        const wallSide = textures.get('wall-side').getSourceImage();
        const wallSideBottom = textures.get('wall-side-bottom').getSourceImage();
        const door = textures.get('door').getSourceImage();
        const colortile = textures.get('colortileR').getSourceImage();
        const bg = [];

        // Draw background
        this.redrawGrass();

        // Draw top wall
        let x = (worldWidth - roomWidth) / 2;
        let y = (worldHeight - roomHeight) / 2 - wall.height;
        bg.push(add.tileSprite(x, y, roomWidth, wall.height, 'wall' + info.cols % 3 % 2)
                   .setOrigin(0).setDepth(y + wall.height));

        // Draw side walls
        bg.push(add.tileSprite(x - wallSide.width, y, wallSide.width, roomHeight + wall.height - wallSideBottom.height, 'wall-side')
                   .setOrigin(0).setDepth(y + wall.height + roomHeight));
        bg.push(add.tileSprite(x + roomWidth, y, wallSide.width, roomHeight + wall.height - wallSideBottom.height, 'wall-side')
                   .setOrigin(0).setDepth(y + wall.height + roomHeight));

        // Draw floor
        y += wall.height;
        bg.push(add.tileSprite(x, y, roomWidth, roomHeight, 'floor')
                   .setOrigin(0).setDepth(0));
        for (let r = 0; r < info.rows; r++) {
            for (let c = 0; c < info.cols; c++) {
                const t = tiles[r][c];
                if ('RGBY'.includes(t)) {
                    bg.push(add.image(x + (c + 0.5) * tileWidth,
                                      y + (r + 0.5) * tileHeight,
                                      'colortile' + t)
                               .setOrigin(0.5).setDepth(0));
                } else if (t == 'O') {
                    bg.push(add.image(x + (c + 0.5) * tileWidth,
                                      y + (r + 0.5) * tileHeight,
                                      'desk')
                               .setOrigin(0.5, 0.8).setDepth(y + (r + 0.5) * tileHeight));
                }
            }
        }

        // Draw bottom side walls
        y += roomHeight - wall.height;
        bg.push(add.image(x - wallSideBottom.width, y + wall.height - wallSideBottom.height, 'wall-side-bottom')
                   .setOrigin(0).setDepth(y + wall.height));
        bg.push(add.image(x + roomWidth, y + wall.height - wallSideBottom.height, 'wall-side-bottom')
                   .setOrigin(0).setDepth(y + wall.height));

        // Draw doors
        let remainingCols = info.cols;
        for (const cols of tiles.at(-1).split('X').map(x => x.length)) {
            if (cols > 0) {
                bg.push(add.tileSprite(x, y, cols * tileWidth, wall.height, 'wall' + cols % 3 % 2)
                           .setOrigin(0).setDepth(y + wall.height));
                x += cols * tileWidth;
                remainingCols -= cols;
            }
            if (remainingCols > 0) {
                remainingCols--;
                bg.push(add.image(x, y, 'door')
                           .setOrigin(0).setDepth(y + wall.height));
                x += tileWidth;
            }
        }

        this.viewWidth = info.viewWidth;
        this.viewHeight = info.viewHeight;
        this.initZoom();
        if (levels[this.level].done && interrupts.includes('done')) {
            bg.forEach(e => e.destroy());
            return 'done';
        }
        const res = await this.setupInterrupts(...interrupts);
        bg.forEach(e => e.destroy());
        return res;
    }

    async chooseMode() {
        const { add, textures } = this.scene;
        const bg = [];
        this.redrawGrass();
        const font = {
            fontSize: '40px',
            color: '#000',
            backgroundColor: '#eee',
            padding: { x: 30, y: 20 }
        };
        this.viewWidth = tileWidth * 9;
        this.viewHeight = tileHeight * 9;
        this.initZoom();
        const mode = await new Promise(resolve => {
            const x = worldWidth / 2;
            const y = worldHeight / 2;
            bg.push(add.text(x, y - 60, 'Single Player', font)
                       .setOrigin(0.5).setInteractive().on('pointerdown', () => {
                           resolve('single player');
            }));
            bg.push(add.text(x, y + 60, 'Multiplayer', font)
                       .setOrigin(0.5).setInteractive().on('pointerdown', () => {
                           resolve('multiplayer');
            }));
        });
        bg.forEach(e => e.destroy());
        return mode;
    }

    async chooseAvatar() {
        this.viewWidth = tileWidth * 17;
        this.viewHeight = tileHeight * 13;
        const { add, textures } = this.scene;
        const bg = [];
        this.redrawGrass();
        const avatars = [];
        let interrupt = null;
        let x = (worldWidth - this.viewWidth) / 2;
        let y = (worldHeight - this.viewHeight) / 2;
        bg.push(add.text(worldWidth / 2, y + 50, 'Choose your avatar', {
            fontSize: '70px',
            color: '#000'
        }).setOrigin(0.5, 0));
        y += tileHeight * 2;
        // girls
        for (let i = 0; i < 25; i++) {
            const index = i;
            avatars.push(add.sprite(x + (i % 5 + 0.5) * tileWidth * 1.6 + 9 * tileWidth,
                                    y + Math.floor(i / 5) * tileHeight * 2,
                                    lpc[i], 9)
                            .setOrigin(0.5, 0).setInteractive().setScale(2)
                            .on('pointerdown', () => interrupt?.(index)));
        }
        // boys
        for (let i = 0; i < 25; i++) {
            const index = i + 25;
            avatars.push(add.sprite(x + (i % 5 + 0.5) * tileWidth * 1.6,
                                    y + Math.floor(i / 5) * tileHeight * 2,
                                    lpc[i + 25], 9)
                            .setOrigin(0.5, 0).setInteractive().setScale(2)
                            .on('pointerdown', () => interrupt?.(index)));
        }
        this.initZoom();
        const animate = i => {
            const r = Math.random();
            if (r < 0.2) {
                avatars[i].play(lpc[i] + ':' + Math.floor(r / 0.2 * 4));
            } else if (r < 0.3) {
                if (avatars[i].anims.isPlaying) {
                    const f = ((4 - avatars[i].anims.getName().at(-1)) % 4) * 9;
                    avatars[i].stop();
                    avatars[i].setFrame(f);
                }
            }
        };
        while (true) {
            avatars.forEach((e, i) => animate(i));
            const choseAvatar = await new Promise(resolve => {
                this.scene.time.delayedCall(300, resolve);
                interrupt = resolve;
            });
            if (choseAvatar != null) {
                const avatar = avatars.splice(choseAvatar, 1)[0];
                avatars.forEach(e => e.destroy());
                for (let i = 3; i >= 0; i--) {
                    avatar.play(lpc[choseAvatar] + ':' + i);
                    await this.delay(500);
                }
                avatar.destroy();
                bg.forEach(e => e.destroy());
                return choseAvatar;
            }
        }
    }
}
