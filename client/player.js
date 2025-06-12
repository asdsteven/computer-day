const drc = [-1, 0, 1, 0, -1];

class Player {
    constructor(controller, { name, avatar, row, col, dir, x, y }, isSelf) {
        this.controller = controller;
        this.scene = controller.scene;
        this.name = name;
        this.avatar = avatar;
        this.row = row;
        this.col = col;
        this.dir = dir;
        this.x = x;
        this.y = y;

        const { add } = this.scene;
        this.sprite = add.sprite(0, 0, lpc[avatar], 0)
                         .setOrigin(0.5, 0.9).setScale(2);
        this.container = add.container(0, 0, [
            this.sprite,
            add.text(0, 10, name, {
                fontSize: '16px',
                stroke: isSelf ? '#00f' : '#000',
                strokeThickness: 2
            }).setOrigin(0.5, 0)
        ]);
    }

    destroy() {
        this.container.destroy();
    }

    initLevel(level) {
        this.level = level;
        const { tiles, info } = levels[level];
        this.tiles = tiles;
        this.info = info;
        this.SX = (worldWidth - info.roomWidth) / 2 + tileWidth / 2;
        this.SY = (worldHeight - info.roomHeight) / 2 + tileHeight / 2;
        this.reset();
    }

    reset() {
        this.row = this.info.SR;
        this.col = this.info.SC;
        this.dir = this.info.dir;
        this.container.x = this.SX + this.col * tileWidth + Math.random() * 10 - 5;
        this.container.y = this.SY + this.row * tileHeight + Math.random() * 10 - 5;
        this.container.setDepth(this.container.y);
        this.sprite.setFrame((4 - this.dir) % 4 * 9);
    }

    solved() {
        return this.row >= this.info.rows;
    }

    bounce(r, c) {
        if (r < 0 || c < 0 || c >= this.info.cols) {
            return true;
        }
        if (r >= this.info.rows) {
            return this.tiles[this.row][this.col] != 'X';
        }
        if (this.tiles[r][c] == 'O') {
            return true;
        }
        return false;
    }

    async forward(remote) {
        if (!remote) {
            this.controller.socket?.emit('forward', this.level, this.row, this.col, this.dir, this.controller.syncLevel('forward'));
        }
        const r = this.row + drc[this.dir];
        const c = this.col + drc[this.dir + 1];
        if (this.bounce(r, c)) {
            const rr = this.row + 0.25 * drc[this.dir];
            const cc = this.col + 0.25 * drc[this.dir + 1];
            this.sprite.play(this.sprite.texture.key + ':' + this.dir);
            await new Promise(resolve => {
                this.scene.tweens.chain({
                    targets: this.container,
                    tweens: [{
                        x: this.SX + cc * tileWidth + Math.random() * 10 - 5,
                        y: this.SY + rr * tileHeight + Math.random() * 10 - 5,
                        depth: this.SY + rr * tileHeight,
                        duration: 125,
                        onComplete: () => {
                            this.sprite.anims.reverse();
                        }
                    }, {
                        x: this.SX + this.col * tileWidth + Math.random() * 10 - 5,
                        y: this.SY + this.row * tileHeight + Math.random() * 10 - 5,
                        depth: this.SY + this.row * tileHeight,
                        duration: 125,
                        onComplete: () => {
                            this.sprite.anims.stop();
                            this.sprite.setFrame((4 - this.dir) % 4 * 9);
                            resolve();
                        }
                    }]
                });
            });
            await this.controller.delay(250);
            return;
        }
        this.row = r;
        this.col = c;
        this.sprite.play(this.sprite.texture.key + ':' + this.dir);
        await new Promise(resolve => {
            this.scene.tweens.add({
                targets: this.container,
                x: this.SX + this.col * tileWidth + Math.random() * 10 - 5,
                y: this.SY + this.row * tileHeight + Math.random() * 10 - 5,
                depth: this.SY + this.row * tileHeight,
                duration: 500,
                onComplete: () => {
                    this.sprite.stop();
                    this.sprite.setFrame((4 - this.dir) % 4 * 9);
                    resolve();
                }
            });
        });
    }

    async turn(ddir, remote) {
        if (!remote) {
            this.controller.socket?.emit('turn', this.level, this.row, this.col, this.dir, ddir, this.controller.syncLevel('turn'));
        }
        const prevDir = this.dir;
        this.dir = (this.dir + 4 + ddir) % 4;
        this.sprite.play(this.sprite.texture.key + ':' + prevDir);
        await this.controller.delay(125);
        this.sprite.play(this.sprite.texture.key + ':' + this.dir);
        this.sprite.anims.setProgress(0.75);
        await this.controller.delay(125);
        this.sprite.stop();
        this.sprite.setFrame((4 - this.dir) % 4 * 9);
        await this.controller.delay(125);
    }

    async wander(x, y, remote) {
        return;
        if (!remote) {
            if (!this.solved()) {
                return;
            }
            this.controller.socket?.emit('wander', this.level, x, y, this.controller.syncLevel('wander'));
        }
        if (x < this.sprite.x) {
            this.dir = 3;
        } else {
            this.dir = 1;
        }
        this.sprite.play(this.sprite.texture.key + ':' + this.dir);
        await new Promise(resolve => {
            this.scene.tweens.add({
                targets: this.container,
                x: x,
                y: y,
                depth: y,
                duration: Math.sqrt(x*x + y*y) / tileWidth * 125,
                onComplete: () => {
                    this.sprite.stop();
                    this.sprite.setFrame((4 - this.dir) % 4 * 9);
                    resolve();
                }
            });
        });
    }
}
