const TILE_SIZE = 32;  // Size of each grid cell (adjust based on map design)
const corridorWidth = TILE_SIZE * 10;
const corridorHeight = TILE_SIZE * 4;
const classroomWidth = TILE_SIZE * 12;
const classroomHeight = TILE_SIZE * 6;

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

    create() {
        const { add, anims, textures } = this;
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

        // Draw player
        this.player = new Player(
            add.sprite(x, y + TILE_SIZE * 0.6, 'lpc-wav-bro-blu.png', 27)
               .setOrigin(0, 1).setDepth(1),
            add.image(x - TILE_SIZE * 1.2, y - TILE_SIZE * 0.5, 'start')
               .setOrigin(0).setInteractive(),
            add.image(x - TILE_SIZE * 1.2, y + TILE_SIZE * 0.5, 'stop')
               .setOrigin(0).setAlpha(0.5)
        );

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

        // Zoom
        const c = this.cameras.main;
        const worldWidth = classroomWidth + 2 * corridorWidth;
        const worldHeight = classroomHeight + 2 * corridorHeight;
        const preferredWidth = classroomWidth + 4 * TILE_SIZE;
        const preferredHeight = classroomHeight + 4 * TILE_SIZE;
        const zoom = () => {
            if (c.width / c.height > worldWidth / preferredHeight) {
                // very wide
                c.setZoom(c.width / worldWidth);
            } else if (c.height / c.width > worldHeight / preferredWidth) {
                // very tall
                c.setZoom(c.height / worldHeight);
            } else if (c.width / c.height > preferredWidth / preferredHeight) {
                // wide
                c.setZoom(c.height / preferredHeight);
            } else {
                // tall
                c.setZoom(c.width / preferredWidth);
            }
        };
        c.setBounds(0, 0, worldWidth, worldHeight);
        zoom();
        c.centerOn(worldWidth / 2, worldHeight / 2);
        this.scale.on('resize', () => {
            const centerX = c.midPoint.x;
            const centerY = c.midPoint.y;
            zoom();
            c.centerOn(centerX, centerY);
        });
    }

    update() {}
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser',
    width: corridorWidth * 2 + classroomWidth,
    height: corridorHeight * 2 + classroomHeight,
    scene: ClassroomScene,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 1,
            height: 1
        }
    }
});
