const TILE_SIZE = 64;  // Size of each grid cell (adjust based on map design)
const corridorWidth = TILE_SIZE * 10;
const corridorHeight = TILE_SIZE * 2;
const classroomWidth = TILE_SIZE * 12;
const classroomHeight = TILE_SIZE * 6;
const drc = [-1, 0, 1, 0, -1];

class ClassroomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ClassroomScene' });
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
        this.load.spritesheet('student', 'assets/lpc.png', {
            frameWidth: 128,
            frameHeight: 128
        });
    }

    create() {
        const corridor = this.textures.get('corridor').source[0];
        const wall = this.textures.get('wall').source[0];
        const door = this.textures.get('door').source[0];

        // Draw background
        let x = 0;
        let y = 0;
        this.add.tileSprite(x, y, classroomWidth + corridorWidth * 2, classroomHeight + corridorHeight * 2, 'floor2').setOrigin(0);

        // Draw top wall
        x += corridorWidth;
        y += corridorHeight - wall.height;
        this.add.tileSprite(x, y, classroomWidth, wall.height, 'wall').setOrigin(0);

        // Draw classroom floor
        y += wall.height;
        this.add.tileSprite(x, y, classroomWidth, classroomHeight, 'floor').setOrigin(0);
        this.interpreter = null;
        this.startButton = this.add.image(x - 70, y, 'start').setInteractive().setOrigin(0);
        this.stopButton = this.add.image(x - 70, y + 70, 'stop').setAlpha(0.5).setOrigin(0);
        this.startButton.on('pointerdown', async () => {
            if (this.interpreter) {
                return;
            }
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
            this.currentRow = 0;
            this.currentCol = 0;
            this.dir = 1;
            this.player.x = corridorWidth + this.currentCol * TILE_SIZE;
            this.player.y =  corridorHeight + this.currentRow * TILE_SIZE + TILE_SIZE * 0.6;
        });
        this.stopButton.on('pointerdown', async () => {
            if (!this.interpreter || this.interpreter.onStop) {
                return;
            }
            await this.interpreter.stop();
        });

        // Draw player
        this.player = this.add.sprite(corridorWidth, corridorHeight + TILE_SIZE * 0.6, 'student');
        this.player.setOrigin(0, 1);
        this.currentRow = 0;
        this.currentCol = 0;
        this.dir = 1;
        this.moving = false; // Prevent multiple movements at once
        this.cursors = this.input.keyboard.createCursorKeys();

        // Draw bottom wall
        y += classroomHeight - wall.height;
        this.add.tileSprite(x, y, classroomWidth - door.width, wall.height, 'wall').setOrigin(0);

        // Draw bottom door
        x += classroomWidth - door.width
        this.add.image(x, y, 'door').setOrigin(0);
    }

    update() {
        if (this.moving) return; // Ensure only one movement at a time

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
            this.moving = true;
            this.currentRow += drc[this.dir];
            this.currentCol += drc[this.dir + 1];
            this.tweens.add({
                targets: this.player,
                x: corridorWidth + this.currentCol * TILE_SIZE,
                y: corridorHeight + this.currentRow * TILE_SIZE + TILE_SIZE * 0.6,
                duration: 300,
                onComplete: () => {
                    this.moving = false;
                    resolve();
                }
            });
        });
    }

    async turnLeft() {
        return new Promise(resolve => {
            this.moving = true;
            this.dir = (this.dir + 3) % 4;
            this.moving = false;
            resolve();
        });
    }

    async turnRight() {
        return new Promise(resolve => {
            this.moving = true;
            this.dir = (this.dir + 1) % 4;
            this.moving = false;
            resolve();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser',
    width: corridorWidth * 2 + classroomWidth,
    height: corridorHeight * 2 + classroomHeight,
    scene: ClassroomScene,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH  // Centers it properly
    }
};

const game = new Phaser.Game(config);
