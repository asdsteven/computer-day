const TILE_SIZE = 64;  // Size of each grid cell (adjust based on map design)
const corridorWidth = TILE_SIZE * 10;
const corridorHeight = TILE_SIZE * 2;
const classroomWidth = TILE_SIZE * 12;
const classroomHeight = TILE_SIZE * 6;
const drc = [-1, 0, 1, 0, -1];

class ClassroomScene extends Phaser.Scene {
    constructor() {
        super('ClassroomScene');
    }

    preload() {
        const loadImage = (image) => this.load.image(image, 'assets/' + image + '.png');
        loadImage('corridor');
        loadImage('wall');
        loadImage('floor');
        loadImage('floor2');
        loadImage('door');
        loadImage('start');
        loadImage('stop');
        for (const png of lpc) {
            this.load.spritesheet(png, 'assets/' + png, {
                frameWidth: 128,
                frameHeight: 128
            });
        }
    }

    create() {
        for (const png of lpc) {
            this.anims.create({
                key: png + ':0',
                frames: this.anims.generateFrameNumbers(png, { start: 1, end: 8 }),
                frameRate: 16,
                repeat: -1
            });
            this.anims.create({
                key: png + ':3',
                frames: this.anims.generateFrameNumbers(png, { start: 10, end: 17 }),
                frameRate: 16,
                repeat: -1
            });
            this.anims.create({
                key: png + ':2',
                frames: this.anims.generateFrameNumbers(png, { start: 19, end: 26 }),
                frameRate: 16,
                repeat: -1
            });
            this.anims.create({
                key: png + ':1',
                frames: this.anims.generateFrameNumbers(png, { start: 28, end: 35 }),
                frameRate: 16,
                repeat: -1
            });
            this.anims.create({
                key: png + ':dance',
                frames: this.anims.generateFrameNumbers(png, { start: 0, end: 35 }),
                frameRate: 16,
                repeat: -1
            });
        }

        const corridor = this.textures.get('corridor').source[0];
        const wall = this.textures.get('wall').source[0];
        const door = this.textures.get('door').source[0];

        // Draw background
        let x = 0;
        let y = 0;
        this.add.tileSprite(x, y, classroomWidth + corridorWidth * 2, classroomHeight + corridorHeight * 2, 'floor2').setOrigin(0).setDepth(-1);

        // Draw top wall
        x += corridorWidth;
        y += corridorHeight - wall.height;
        this.add.tileSprite(x, y, classroomWidth, wall.height, 'wall').setOrigin(0).setDepth(-1);

        // Draw classroom floor
        y += wall.height;
        this.add.tileSprite(x, y, classroomWidth, classroomHeight, 'floor').setOrigin(0).setDepth(-1);
        this.interpreter = null;
        this.startButton = this.add.image(x - 70, y, 'start').setInteractive().setOrigin(0);
        this.stopButton = this.add.image(x - 70, y + 70, 'stop').setAlpha(0.5).setOrigin(0);
        this.startButton.on('pointerdown', async () => {
            if (this.interpreter) {
                return;
            }
            this.player.setData({row: 0, col: 0, dir: 1});
            this.player.setPosition(corridorWidth, corridorHeight + TILE_SIZE * 0.6)
            this.startButton.disableInteractive().setAlpha(0.5);
            this.stopButton.setInteractive().setAlpha(1);
            this.interpreter = new Interpreter(this, Blockly.OpCode.greenFlagToCode());
            const peaceful = await this.interpreter.execute();
            if (peaceful && this.interpreter.onStop) {
                this.interpreter.onStop();
            }
            this.interpreter = null;
            this.startButton.setInteractive().setAlpha(1);
            this.stopButton.disableInteractive().setAlpha(0.5);
        });
        this.stopButton.on('pointerdown', () => {
            if (!this.interpreter || this.interpreter.onStop) {
                return;
            }
            this.interpreter.stop();
        });

        // Draw player
        this.player = this.add.sprite(corridorWidth, corridorHeight + TILE_SIZE * 0.6, 'lpc-wav-bro-blu.png', 27).setOrigin(0, 1).setDepth(1);
        this.player.setData({row: 0, col: 0, dir: 1});
        this.cursors = this.input.keyboard.createCursorKeys();

        // Draw bottom wall
        y += classroomHeight - wall.height;
        this.add.tileSprite(x, y, classroomWidth - door.width, wall.height, 'wall').setOrigin(0).setDepth(2);

        // Draw bottom door
        x += classroomWidth - door.width
        this.add.image(x, y, 'door').setOrigin(0).setDepth(2);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.turnLeft();
        } else if (this.cursors.right.isDown) {
            this.turnRight()
        } else if (this.cursors.up.isDown) {
            this.forward();
        }
    }

    async forward() {
        return new Promise(resolve => {
            const p = this.player;
            p.incData('row', drc[p.data.values.dir]);
            p.incData('col', drc[p.data.values.dir + 1]);
            p.play(p.texture.key + ':' + p.data.values.dir);
            this.tweens.add({
                targets: p,
                x: corridorWidth + p.data.values.col * TILE_SIZE,
                y: corridorHeight + p.data.values.row * TILE_SIZE + TILE_SIZE * 0.6,
                duration: 384,
                onComplete: () => {
                    p.stop();
                    p.setFrame((4 - p.data.values.dir) % 4 * 9);
                    resolve();
                }
            });
        });
    }

    async turn(ddir) {
        return new Promise(resolve => {
            const p = this.player;
            const prevDir = p.data.values.dir;
            p.data.values.dir = (p.data.values.dir + 4 + ddir) % 4;
            p.play(p.texture.key + ':' + prevDir);
            this.time.delayedCall(128, () => {
                p.stop();
                p.play(p.texture.key + ':' + p.data.values.dir);
            });
            this.time.delayedCall(256, () => {
                p.stop();
                p.setFrame((4 - p.data.values.dir) % 4 * 9);
            });
            this.time.delayedCall(384, resolve);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser',
    width: corridorWidth * 2 + classroomWidth,
    height: corridorHeight * 2 + classroomHeight,
    scene: ClassroomScene,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH  // Centers it properly
    }
};

const game = new Phaser.Game(config);
