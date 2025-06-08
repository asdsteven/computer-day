class ComputerDayScene extends Phaser.Scene {
    constructor() {
        super('ComputerDayScene');
    }

    preload() {
        const loadImage = (image) => this.load.image(image, 'assets/' + image + '.png');
        loadImage('wall0');
        loadImage('wall1');
        loadImage('wall-side');
        loadImage('wall-side-bottom');
        loadImage('floor');
        loadImage('door');
        loadImage('desk');
        loadImage('start');
        loadImage('stop');
        loadImage('colortileR');
        loadImage('colortileG');
        loadImage('colortileB');
        loadImage('colortileY');
        this.load.spritesheet('grass', 'assets/grass.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        for (const png of lpc) {
            this.load.spritesheet(png, 'assets/' + png, {
                frameWidth: 64,
                frameHeight: 64
            });
        }
    }

    async delay(ms) {
        return new Promise(resolve => {
            this.time.delayedCall(ms, resolve);
        });
    }

    addTeacherUI() {
        const uiCamera = this.cameras.add(0, 0, 50, 20);
        uiCamera.setBackgroundColor(0xffffff);
        const { add } = this;
        const container = add.container(0, 0);
        let expanded = false;
        const font = {
            fontSize: '16px',
            color: '#000'
        };
        let y = 40;
        container.add(add.text(0, 0, 'menu', font).setOrigin(0).setInteractive().on("pointerdown", () => {
            if (expanded) {
                expanded = false;
                uiCamera.setViewport(0, 0, 50, 20);
            } else {
                expanded = true;
                uiCamera.setViewport(0, 0, 200, y);
            }
        }));
        container.add(add.text(0, y, 'start', font).setOrigin(0).setInteractive().on("pointerdown", () => {
        }));
        y += 30;
        container.add(add.text(0, y, 'skip mini game', font).setOrigin(0).setInteractive().on("pointerdown", () => {
        }));
        y += 30;
        container.add(add.text(0, y, 'show answer', font).setOrigin(0).setInteractive().on("pointerdown", () => {
        }));
        y += 30;
        container.add(add.text(0, y, 'skip this level', font).setOrigin(0).setInteractive().on("pointerdown", () => {
        }));
        y += 30;
        this.cameras.main.ignore(container);
    }

    async chooseAvatar() {
        this.viewWidth = tileWidth * 17;
        this.viewHeight = tileHeight * 13;
        this.worldWidth = this.viewWidth * 3;
        this.worldHeight = this.viewHeight * 3;
        const { add, textures } = this;
        const grass = textures.getFrame('grass', 0);
        const bg = [];
        const avatars = [];
        for (let y = 0; y < this.worldHeight; y += grass.height) {
            for (let x = 0; x < this.worldWidth; x += grass.width) {
                bg.push(add.sprite(x, y, 'grass', Phaser.Math.RND.pick([0, 0, 0, 0, 0, 0, 9, 9, 9, 18]))
                           .setOrigin(0).setDepth(-1));
            }
        }
        let choseAvatar = null;
        let choseAvatarWake = null;
        let x = (this.worldWidth - this.viewWidth) / 2;
        let y = (this.worldHeight - this.viewHeight) / 2;
        bg.push(add.text(this.worldWidth / 2, y + 20, 'Choose your avatar', {
            fontSize: '45px',
            color: '#000'
        }).setOrigin(0.5, 0));
        y += tileHeight * 2.5;
        // girls
        for (let i = 0; i < 25; i++) {
            const index = i;
            avatars.push(add.sprite(x + (i % 5 + 0.5) * tileWidth * 1.6 + 9 * tileWidth,
                                    y + Math.floor(i / 5) * tileHeight * 2,
                                    lpc[i], 9)
                            .setOrigin(0.5, 0)
                            .setInteractive()
                            .on('pointerdown', () => {
                                if (choseAvatar !== null) {
                                    return;
                                }
                                choseAvatar = index;
                                choseAvatarWake?.();
                            })
            );
        }
        // boys
        for (let i = 0; i < 25; i++) {
            const index = i + 25;
            avatars.push(add.sprite(x + (i % 5 + 0.5) * tileWidth * 1.6,
                                    y + Math.floor(i / 5) * tileHeight * 2,
                                    lpc[i + 25], 9)
                            .setOrigin(0.5, 0)
                            .setInteractive()
                            .on('pointerdown', () => {
                                if (choseAvatar !== null) {
                                    return;
                                }
                                choseAvatar = index;
                                choseAvatarWake?.();
                            })
            );
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
        while (choseAvatar === null) {
            avatars.forEach((e, i) => animate(i));
            await Promise.race([
                this.delay(300),
                new Promise(resolve => {
                    choseAvatarWake?.();
                    choseAvatarWake = resolve;
                })
            ]);
        }
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

    async showLevel({tiles}) {
        const tileInfo = parseTileInfo(tiles);
        const { roomWidth, roomHeight, worldWidth, worldHeight } = tileInfo;
        this.viewWidth = tileInfo.viewWidth;
        this.viewHeight = tileInfo.viewHeight;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        const { add, textures } = this;
        const wall = textures.get('wall0').getSourceImage();
        const wallSide = textures.get('wall-side').getSourceImage();
        const wallSideBottom = textures.get('wall-side-bottom').getSourceImage();
        const door = textures.get('door').getSourceImage();
        const grass = textures.getFrame('grass', 0);
        const colortile = textures.get('colortileR').getSourceImage();
        const bg = [];

        // Draw background
        for (let y = 0; y < worldHeight; y += grass.height) {
            for (let x = 0; x < worldWidth; x += grass.width) {
                bg.push(add.sprite(x, y, 'grass', Phaser.Math.RND.pick([0, 0, 0, 0, 0, 0, 9, 9, 9, 18]))
                           .setOrigin(0).setDepth(-1));
            }
        }

        // Draw top wall
        let x = (worldWidth - roomWidth) / 2;
        let y = (worldHeight - roomHeight) / 2 - wall.height;
        bg.push(add.tileSprite(x, y, roomWidth, wall.height, 'wall0')
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
        for (let r = 0; r < tileInfo.rows; r++) {
            for (let c = 0; c < tileInfo.cols; c++) {
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

        // Interpreter, player, obstacles
        this.interpreter = new Interpreter(
            new Player(add.sprite(x + (tileInfo.SC + 0.5) * tileWidth, y + (tileInfo.SR + 0.5) * tileHeight, lpc[this.avatar], 27)
                          .setOrigin(0.5, 0.9).setDepth(y + (tileInfo.SR + 0.5) * tileHeight),
                       tiles,
                       tileInfo
            ),
            add.image(x - 5, y, 'start')
               .setOrigin(1, 0).setDepth(9999).setInteractive(),
            add.image(x - 5, y + 35, 'stop')
               .setOrigin(1, 0).setDepth(9999).setAlpha(0.5)
        );

        // Draw bottom left side wall
        y += roomHeight - wall.height;
        bg.push(add.image(x - wallSideBottom.width, y + wall.height - wallSideBottom.height, 'wall-side-bottom')
                   .setOrigin(0).setDepth(y + wall.height));

        // Draw doors
        for (const X of tileInfo.Xs) {
            if (X > 0) {
                bg.push(add.tileSprite(x, y, X * tileWidth, wall.height, 'wall' + X % 3 % 2)
                           .setOrigin(0).setDepth(y + wall.height));
                x += X * tileWidth;
            }
            if (x < roomWidth * 2) {
                bg.push(add.image(x, y, 'door')
                           .setOrigin(0).setDepth(y + wall.height));

                x += tileWidth;
            }
        }

        // Draw bottom right side wall
        bg.push(add.image(x, y + wall.height - wallSideBottom.height, 'wall-side-bottom')
                   .setOrigin(0).setDepth(y + wall.height));

        this.initZoom();

        await this.interpreter.solved();

        this.interpreter.destroy();
        bg.forEach(e => e.destroy());
    }

    async gameflow() {
        this.avatar = 0;
        this.avatar = await this.chooseAvatar();
        await this.showLevel(levels[0]);
    }

    create() {
        const { anims } = this;
        for (const png of lpc) {
            anims.create({
                key: png + ':0',
                frames: anims.generateFrameNumbers(png, { start: 1, end: 8 }),
                frameRate: 16,
                repeat: -1
            });
            anims.create({
                key: png + ':3',
                frames: anims.generateFrameNumbers(png, { start: 10, end: 17 }),
                frameRate: 16,
                repeat: -1
            });
            anims.create({
                key: png + ':2',
                frames: anims.generateFrameNumbers(png, { start: 19, end: 26 }),
                frameRate: 16,
                repeat: -1
            });
            anims.create({
                key: png + ':1',
                frames: anims.generateFrameNumbers(png, { start: 28, end: 35 }),
                frameRate: 16,
                repeat: -1
            });
        }

        // Zoom
        this.viewWidth = 640;
        this.viewHeight = 480;
        this.worldWidth = 640;
        this.worldHeight = 480;
        const c = this.cameras.main;
        const zoom = () => {
            if (c.width / c.height > this.worldWidth / this.viewHeight) {
                // very wide
                c.setZoom(c.width / this.worldWidth);
            } else if (c.height / c.width > this.worldHeight / this.viewWidth) {
                // very tall
                c.setZoom(c.height / this.worldHeight);
            } else if (c.width / c.height > this.viewWidth / this.viewHeight) {
                // wide
                c.setZoom(c.height / this.viewHeight);
            } else {
                // tall
                c.setZoom(c.width / this.viewWidth);
            }
        };
        c.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.initZoom = () => {
            c.setBounds(0, 0, this.worldWidth, this.worldHeight);
            zoom();
            c.centerOn(this.worldWidth / 2, this.worldHeight / 2);
        };
        this.scale.on('resize', () => {
            const centerX = c.midPoint.x;
            const centerY = c.midPoint.y;
            zoom();
            c.centerOn(centerX, centerY);
        });

        if (window.location.href.endsWith("/teacher")) {
            this.addTeacherUI();
        } else {
            this.gameflow();
        }
    }

    update() {}
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser',
    width: 640,
    height: 480,
    scene: ComputerDayScene,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 1,
            height: 1
        }
    }
});
