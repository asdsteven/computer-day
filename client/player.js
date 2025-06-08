const drc = [-1, 0, 1, 0, -1];

class Player {
    constructor(sprite, tiles, tileInfo) {
        this.sprite = sprite;
        this.tiles = tiles;
        this.tileInfo = tileInfo;
        const { worldWidth, worldHeight, roomWidth, roomHeight } = tileInfo;
        this.left = (worldWidth - roomWidth) / 2 + 0.5 * tileWidth;
        this.top = (worldHeight - roomHeight) / 2 + 0.5 * tileHeight;
        this.reset();
    }

    reset() {
        this.row = this.tileInfo.SR;
        this.col = this.tileInfo.SC;
        this.dir = this.tileInfo.dir;
        this.sprite.setPosition(this.left + this.col * tileWidth,
                                this.top + this.row * tileHeight);
        this.sprite.setFrame((4 - this.dir) % 4 * 9);
    }

    solved() {
        return this.row >= this.tileInfo.rows;
    }

    bounce(r, c) {
        if (r < 0 || c < 0 || c >= this.tileInfo.cols) {
            return true;
        }
        if (r >= this.tileInfo.rows) {
            return this.tiles[this.row][this.col] != 'X';
        }
        if (this.tiles[r][c] == 'O') {
            return true;
        }
        return false;
    }

    async forward() {
        const r = this.row + drc[this.dir];
        const c = this.col + drc[this.dir + 1];
        if (this.bounce(r, c)) {
            const rr = this.row + 0.25 * drc[this.dir];
            const cc = this.col + 0.25 * drc[this.dir + 1];
            this.sprite.play(this.sprite.texture.key + ':' + this.dir);
            await new Promise(resolve => {
                this.sprite.scene.tweens.add({
                    targets: this.sprite,
                    x: this.left + cc * tileWidth,
                    y: this.top + rr * tileHeight,
                    duration: 125,
                    onComplete: () => {
                        this.sprite.anims.reverse();
                        resolve();
                    }
                });
            });
            await new Promise(resolve => {
                this.sprite.scene.tweens.add({
                    targets: this.sprite,
                    x: this.left + this.col * tileWidth,
                    y: this.top + this.row * tileHeight,
                    duration: 125,
                    onComplete: () => {
                        this.sprite.stop();
                        this.sprite.setFrame((4 - this.dir) % 4 * 9);
                        resolve();
                    }
                });
            });
            await this.sprite.scene.delay(250);
            return;
        }
        this.row = r;
        this.col = c;
        this.sprite.play(this.sprite.texture.key + ':' + this.dir);
        await new Promise(resolve => {
            this.sprite.scene.tweens.add({
                targets: this.sprite,
                x: this.left + this.col * tileWidth,
                y: this.top + this.row * tileHeight,
                duration: 500,
                onComplete: () => {
                    this.sprite.stop();
                    this.sprite.setFrame((4 - this.dir) % 4 * 9);
                    resolve();
                }
            });
        });
    }

    async turn(ddir) {
        const prevDir = this.dir;
        this.dir = (this.dir + 4 + ddir) % 4;
        this.sprite.play(this.sprite.texture.key + ':' + prevDir);
        await this.sprite.scene.delay(125);
        this.sprite.play(this.sprite.texture.key + ':' + this.dir);
        this.sprite.anims.setProgress(0.75);
        await this.sprite.scene.delay(125);
        this.sprite.stop();
        this.sprite.setFrame((4 - this.dir) % 4 * 9);
        await this.sprite.scene.delay(125);
    }
}
