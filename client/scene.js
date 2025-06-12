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
        for (const room of ['1A','2A','3A','3S','P4','5A','5S','6A','6S']) {
            loadImage('qr' + room);
        }
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

    async create() {
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

        this.controller = new Controller(this);
        const controller = this.controller;
        this.input.on('pointerdown', function (pointer) {
            console.log('Touch position:', pointer.x, pointer.y);
            var worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            console.log('World position:', worldPoint.x, worldPoint.y);
            controller.interpreter?.player.wander(worldPoint.x, worldPoint.y);
        });
        if (window.location.pathname.slice(1).startsWith('teacher')) {
            document.getElementById('phaser').style = 'height:100vh;line-height:0;font-size:0';
            document.getElementById('scratch-blocks').style = 'height:0px';
            while (true) {
                await this.controller.teacherFlow();
            }
        }
        await this.controller.introductory();
        while (true) {
            await this.controller.playerFlow();
        }
    }

    update() {}
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser',
    width: worldWidth / 3,
    height: worldHeight / 3,
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

const workspace = Blockly.inject('scratch-blocks', {
    collapse: false,
    comments: false,
    collapse: false,
    disable: true,
    media: 'scratch-blocks/media/',
    scrollbars: true,
    sounds: false,
    toolbox: document.getElementById('toolbox'),
    trashcan: true
});

