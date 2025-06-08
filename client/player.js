const drc = [-1, 0, 1, 0, -1];

class Player {
    constructor(sprite) {
        this.sprite = sprite;
        this.initX = sprite.x;
        this.initY = sprite.y;
        this.row = 0;
        this.col = 0;
        this.dir = 1;
    }

    reset() {
        this.sprite.setPosition(this.initX, this.initY);
        this.row = 0;
        this.col = 0;
        this.dir = 1;
    }

    async forward() {
        return new Promise(resolve => {
            this.row += drc[this.dir];
            this.col += drc[this.dir + 1];
            this.sprite.play(this.sprite.texture.key + ':' + this.dir);
            this.sprite.scene.tweens.add({
                targets: this.sprite,
                x: this.initX + this.col * tileWidth,
                y: this.initY + this.row * tileHeight,
                duration: 384,
                onComplete: () => {
                    this.sprite.stop();
                    this.sprite.setFrame((4 - this.dir) % 4 * 9);
                    resolve();
                }
            });
        });
    }

    async turn(ddir) {
        return new Promise(resolve => {
            const prevDir = this.dir;
            this.dir = (this.dir + 4 + ddir) % 4;
            this.sprite.play(this.sprite.texture.key + ':' + prevDir);
            this.sprite.scene.time.delayedCall(128, () => {
                this.sprite.stop();
                this.sprite.play(this.sprite.texture.key + ':' + this.dir);
            });
            this.sprite.scene.time.delayedCall(256, () => {
                this.sprite.stop();
                this.sprite.setFrame((4 - this.dir) % 4 * 9);
            });
            this.sprite.scene.time.delayedCall(384, resolve);
        });
    }
}
