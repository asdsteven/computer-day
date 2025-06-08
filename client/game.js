class ClassroomScene extends Phaser.Scene {
    constructor() {
        super('ClassroomScene');
    }

    preload() {
        const loadImage = (image) => this.load.image(image, 'assets/' + image + '.png');
        loadImage('wall0');
        loadImage('wall1');
        loadImage('wall-side');
        loadImage('wall-side-bottom');
        loadImage('floor');
        loadImage('door');
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

    showLevel({tiles}) {
        const { add, textures } = this;
        const tileInfo = parseTileInfo(tiles);
        const wall = textures.get('wall0').getSourceImage();
        const wallSide = textures.get('wall-side').getSourceImage();
        const wallSideBottom = textures.get('wall-side-bottom').getSourceImage();
        const door = textures.get('door').getSourceImage();
        const grass = textures.getFrame('grass', 0);
        const colortile = textures.get('colortileR').getSourceImage();
        const classroomWidth = tileInfo.cols * tileWidth;
        const classroomHeight = tileInfo.rows * tileHeight;
        const worldWidth = classroomWidth * 3;
        const worldHeight = classroomHeight * 3;
        const preferredWidth = classroomWidth + corridorWidth * 2;
        const preferredHeight = classroomHeight + corridorHeight * 2;
        const bg = [];

        // Draw background
        let x = 0;
        let y = 0;
        for (let yy = 0; yy < worldHeight; yy += grass.height) {
            for (let xx = 0; xx < worldWidth; xx += grass.width) {
                bg.push(add.sprite(xx, yy, 'grass', Phaser.Math.RND.pick([0, 0, 0, 0, 0, 0, 9, 9, 9, 18]))
                           .setOrigin(0).setDepth(-1));
            }
        }

        // Draw top wall
        x += classroomWidth;
        y += classroomHeight - wall.height;
        bg.push(add.tileSprite(x, y, classroomWidth, wall.height, 'wall0')
                   .setOrigin(0).setDepth(y + wall.height));

        // Draw side wall
        bg.push(add.tileSprite(x - wallSide.width, y, wallSide.width, classroomHeight + wall.height - wallSideBottom.height, 'wall-side')
                   .setOrigin(0).setDepth(y + wall.height));
        bg.push(add.tileSprite(x + classroomWidth, y, wallSide.width, classroomHeight + wall.height - wallSideBottom.height, 'wall-side')
                   .setOrigin(0).setDepth(y + wall.height));

        // Draw classroom floor
        y += wall.height;
        bg.push(add.tileSprite(x, y, classroomWidth, classroomHeight, 'floor')
                   .setOrigin(0).setDepth(0));
        for (let r = 0; r < tileInfo.rows; r++) {
            for (let c = 0; c < tileInfo.cols; c++) {
                const t = tiles[r][c];
                if (!'RGBY'.includes(t)) {
                    continue;
                }
                bg.push(add.image(x + c * tileWidth + (tileWidth - colortile.width) / 2,
                                  y + r * tileHeight + (tileHeight - colortile.height) / 2,
                                  'colortile' + t).setOrigin(0));
            }
        }

        // Interpreter and player
        this.interpreter = new Interpreter(
            new Player(add.sprite(x + (tileInfo.SC + 0.5) * tileWidth, y + (tileInfo.SR + 0.5) * tileHeight, 'lpc-wav-bro-blu.png', 27)
                          .setOrigin(0.5, 1).setDepth(y + (tileInfo.SR + 0.5) * tileHeight)),
            add.image(x - 5, y, 'start')
               .setOrigin(1, 0).setDepth(9999).setInteractive(),
            add.image(x - 5, y + 35, 'stop')
               .setOrigin(1, 0).setDepth(9999).setAlpha(0.5)
        );

        // Draw bottom left side wall
        y += classroomHeight - wall.height;
        bg.push(add.image(x - wallSideBottom.width, y + wall.height - wallSideBottom.height, 'wall-side-bottom')
                   .setOrigin(0).setDepth(0));

        // Draw doors
        for (const X of tileInfo.Xs) {
            if (X > 0) {
                bg.push(add.tileSprite(x, y, X * tileWidth, wall.height, 'wall' + X % 3 % 2)
                           .setOrigin(0).setDepth(y + wall.height));
                x += X * tileWidth;
            }
            if (x < classroomWidth * 2) {
                bg.push(add.image(x, y, 'door')
                           .setOrigin(0).setDepth(y + wall.height));

                x += tileWidth;
            }
        }

        // Draw bottom right side wall
        bg.push(add.image(x, y + wall.height - wallSideBottom.height, 'wall-side-bottom')
                   .setOrigin(0).setDepth(y + wall.height));

        // Zoom
        const c = this.cameras.main;
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
        const zoomAndCenter = () => {
            const centerX = c.midPoint.x;
            const centerY = c.midPoint.y;
            zoom();
            c.centerOn(centerX, centerY);
        };
        c.setBounds(0, 0, worldWidth, worldHeight);
        zoom();
        c.centerOn(worldWidth / 2, worldHeight / 2);
        this.scale.on('resize', zoomAndCenter);
        return () => {
            this.scale.off('resize', zoomAndCenter);
            this.interpreter.destroy();
            for (const sprite of bg) {
                sprite.destroy();
            }
        };
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
            anims.create({
                key: png + ':dance',
                frames: anims.generateFrameNumbers(png, { start: 0, end: 35 }),
                frameRate: 16,
                repeat: -1
            });
        }
        const destroy = this.showLevel(levels[0]);
    }

    update() {}
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'phaser',
    width: 640,
    height: 480,
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
