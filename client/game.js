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
        loadImage('door');
        this.load.image('student', 'assets/student.png');  // Example player asset
    }

    create() {
        const width = TILE_SIZE * 12;
        const height = TILE_SIZE * 6;
        const corridor = this.textures.get('corridor').source[0];
        const wall = this.textures.get('wall').source[0];
        const door = this.textures.get('door').source[0];
        this.add.image(0, 0, 'corridor').setOrigin(0).setDisplaySize(width, corridor.height / corridor.width * width);
        this.add.tileSprite(0, 0, width, wall.height, 'wall').setOrigin(0);
        this.add.tileSprite(0, wall.height, width, height, 'floor').setOrigin(0);
        this.add.tileSprite(0, height, width - door.width, wall.height, 'wall').setOrigin(0);
        this.add.image(width - door.width, height, 'door').setOrigin(0);
        this.player = this.physics.add.sprite(TILE_SIZE * 3, TILE_SIZE * 3, 'student');
        this.player.setOrigin(0.5, 0.5);
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
            x: this.currentCol * this.gridSize,
            y: this.currentRow * this.gridSize,
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
    width: window.innerWidth,
    height: window.innerHeight - 200,
    scene: ClassroomScene,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,  // Makes the game adjust on resize
        autoCenter: Phaser.Scale.CENTER_BOTH  // Centers it properly
    }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight - 200);
});

