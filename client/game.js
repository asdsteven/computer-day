const TILE_SIZE = 64;  // Size of each grid cell (adjust based on map design)

class ClassroomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ClassroomScene' });
        this.gridSize = TILE_SIZE; // Grid cell size
    }

    preload() {
        const loadImage = (image) => this.load.image(image, 'assets/' + image + '.png');
        loadImage('corridor');
        loadImage('wall');
        loadImage('floor');
        loadImage('floor2');
        loadImage('door');
        this.load.spritesheet('student', 'assets/character_maleAdventurer_sheet.png', {
            frameWidth: 96,
            frameHeight: 128
        });
    }

    create() {
        const corridorSize = this.corridorSize = TILE_SIZE * 2;
        const width = this.classroomWidth = TILE_SIZE * 12;
        const height = this.classroomHeight = TILE_SIZE * 6;
        const corridor = this.textures.get('corridor').source[0];
        const wall = this.textures.get('wall').source[0];
        const door = this.textures.get('door').source[0];

        let x = 0;
        let y = 0;
        this.add.tileSprite(x, y, width + corridorSize * 2, height + corridorSize * 2, 'floor2').setOrigin(0);
        x += corridorSize;
        y += corridorSize - wall.height;
        this.add.tileSprite(x, y, width, wall.height, 'wall').setOrigin(0);
        y += wall.height;
        this.add.tileSprite(x, y, width, height, 'floor').setOrigin(0);
        y += height - wall.height;
        this.add.tileSprite(x, y, width - door.width, wall.height, 'wall').setOrigin(0);
        x += width - door.width
        this.add.image(x, y, 'door').setOrigin(0);

        this.classroomX = corridorSize;
        this.classroomY = corridorSize;
        this.player = this.add.sprite(this.classroomX + TILE_SIZE * 3, this.classroomY + TILE_SIZE * 3, 'student');
        this.player.setOrigin(0, 1);
        this.currentRow = 3;
        this.currentCol = 3;
        this.moving = false; // Prevent multiple movements at once
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.moving) return; // Ensure only one movement at a time

        if (this.cursors.left.isDown && this.currentCol > 0) {
            this.movePlayer(-1, 0);
        } else if (this.cursors.right.isDown && this.currentCol < 9) {
            this.movePlayer(1, 0);
        } else if (this.cursors.up.isDown && this.currentRow > 0) {
            this.movePlayer(0, -1);
        } else if (this.cursors.down.isDown && this.currentRow < 9) {
            this.movePlayer(0, 1);
        }
    }

    movePlayer(deltaCol, deltaRow) {
        this.moving = true;

        this.currentCol += deltaCol;
        this.currentRow += deltaRow;

        this.tweens.add({
            targets: this.player,
            x: this.classroomX + this.currentCol * this.gridSize,
            y: this.classroomY + this.currentRow * this.gridSize,
            duration: 300,
            onComplete: () => {
                this.moving = false;
            }
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser',
    width: 16 * TILE_SIZE,
    height: 10 * TILE_SIZE,
    scene: ClassroomScene,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH  // Centers it properly
    }
};

const game = new Phaser.Game(config);
