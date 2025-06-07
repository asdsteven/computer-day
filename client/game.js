const TILE_SIZE = 64;  // Size of each grid cell (adjust based on map design)
const corridorWidth = TILE_SIZE * 10;
const corridorHeight = TILE_SIZE * 4;
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
        loadImage('wall-side');
        loadImage('wall-side-bottom');
        loadImage('floor');
        loadImage('door');
        loadImage('start');
        loadImage('stop');
        this.load.spritesheet('grass', 'assets/grass.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        for (const png of lpc) {
            this.load.spritesheet(png, 'assets/' + png, {
                frameWidth: 128,
                frameHeight: 128
            });
        }
    }

    linkInterpreter(start, stop) {
        let interpreter = null;
        start.on('pointerdown', async () => {
            if (interpreter) {
                return;
            }
            this.player.setData({row: 0, col: 0, dir: 1});
            this.player.setPosition(corridorWidth, corridorHeight + TILE_SIZE * 0.6)
            start.disableInteractive().setAlpha(0.5);
            stop.setInteractive().setAlpha(1);
            interpreter = new Interpreter(this, Blockly.OpCode.greenFlagToCode());
            const peaceful = await interpreter.execute();
            if (peaceful && interpreter.onStop) {
                interpreter.onStop();
            }
            interpreter = null;
            start.setInteractive().setAlpha(1);
            stop.disableInteractive().setAlpha(0.5);
        });
        stop.on('pointerdown', () => {
            if (!interpreter || interpreter.onStop) {
                return;
            }
            interpreter.stop();
        });
    }

    create() {
        const { add, anims, textures, input } = this;
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
            anims.create({
                key: png + ':dance',
                frames: anims.generateFrameNumbers(png, { start: 0, end: 35 }),
                frameRate: 16,
                repeat: -1
            });
        }

        const corridor = textures.get('corridor').getSourceImage();
        const wall = textures.get('wall').getSourceImage();
        const wallSide = textures.get('wall-side').getSourceImage();
        const wallSideBottom = textures.get('wall-side-bottom').getSourceImage();
        const door = textures.get('door').getSourceImage();
        const grass = textures.getFrame('grass', 0);

        // Draw background
        let x = 0;
        let y = 0;
        for (let yy = 0; yy < classroomHeight + corridorHeight * 2; yy += grass.height) {
            for (let xx = 0; xx < classroomWidth + corridorWidth * 2; xx += grass.width) {
                add.sprite(xx, yy, 'grass', Phaser.Math.RND.pick([0, 0, 0, 0, 0, 0, 9, 9, 9, 18]))
                   .setOrigin(0).setDepth(-1);
            }
        }

        // Draw top wall
        x += corridorWidth;
        y += corridorHeight - wall.height;
        add.tileSprite(x, y, classroomWidth, wall.height, 'wall')
           .setOrigin(0).setDepth(-1);

        // Draw side wall
        add.tileSprite(x - wallSide.width, y, wallSide.width, classroomHeight + wall.height - wallSideBottom.height, 'wall-side')
           .setOrigin(0).setDepth(2);
        add.tileSprite(x + classroomWidth, y, wallSide.width, classroomHeight + wall.height - wallSideBottom.height, 'wall-side')
           .setOrigin(0).setDepth(2);

        // Draw classroom floor
        y += wall.height;
        add.tileSprite(x, y, classroomWidth, classroomHeight, 'floor')
           .setOrigin(0).setDepth(-1);
        this.linkInterpreter(add.image(x - 70, y, 'start').setOrigin(0).setInteractive(),
                             add.image(x - 70, y + 70, 'stop').setOrigin(0).setAlpha(0.5));

        // Draw player
        this.player = add.sprite(corridorWidth, corridorHeight + TILE_SIZE * 0.6, 'lpc-wav-bro-blu.png', 27)
                         .setOrigin(0, 1).setDepth(1)
                         .setData({row: 0, col: 0, dir: 1});

        // Draw bottom wall
        y += classroomHeight - wall.height;
        add.tileSprite(x, y, classroomWidth - door.width, wall.height, 'wall')
           .setOrigin(0).setDepth(2);

        // Draw bottom left wall
        add.image(x - wallSideBottom.width, y + wall.height - wallSideBottom.height, 'wall-side-bottom')
           .setOrigin(0).setDepth(2);

        // Draw bottom door
        x += classroomWidth - door.width;
        add.image(x, y, 'door')
           .setOrigin(0).setDepth(2);

        // Draw bottom right wall
        x += door.width;
        add.image(x, y + wall.height - wallSideBottom.height, 'wall-side-bottom')
           .setOrigin(0).setDepth(2);

        this.cursors = input.keyboard.createCursorKeys();
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

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser',
    width: corridorWidth * 2 + classroomWidth,
    height: corridorHeight * 2 + classroomHeight,
    scene: ClassroomScene,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
});
