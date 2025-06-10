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
        if (window.location.pathname.slice(1).startsWith('teacher')) {
            while (true) {
                await this.controller.teacherFlow();
            }
        }
        await this.controller.introductory();
        while (true) {
            await this.controller.playerFlow();
        }
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
        container.add(add.text(0, 0, 'menu', font).setOrigin(0).setInteractive().on('pointerdown', () => {
            if (expanded) {
                expanded = false;
                uiCamera.setViewport(0, 0, 50, 20);
            } else {
                expanded = true;
                uiCamera.setViewport(0, 0, 200, y);
            }
        }));
        container.add(add.text(0, y, 'show answer', font).setOrigin(0).setInteractive().on('pointerdown', () => {
        }));
        y += 30;
        container.add(add.text(0, y, 'next level', font).setOrigin(0).setInteractive().on('pointerdown', () => {
            socket.emit('next level');
        }));
        y += 30;
        this.cameras.main.ignore(container);
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
