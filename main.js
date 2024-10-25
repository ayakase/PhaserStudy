import Phaser from 'phaser'
import './style.css'

const sizes = {
    width: 1000,
    height: 500,
}
const gravity = 600;
const speedDown = 300
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
        this.player
        this.playerSpeed = speedDown + 300
        this.cursor
        this.target
        this.points = 0
        this.scoreText;
        this.canScore = true;
    }

    preload() {
        this.load.image('bg', '/assets/bg.jpg')
        this.load.image('player', '/assets/player.png')
        this.load.image('hotdog', '/assets/foods/55_hotdog_sauce.png')
    }

    create() {
        // [bg]
        const bg = this.add.image(0, 0, "bg").setOrigin(0, 0)
        bg.setDisplaySize(sizes.width, sizes.height);

        // [player]
        this.player = this.physics.add.image(sizes.width / 2, sizes.height - 100, "player").setOrigin(0.5, 0.5)
        this.player.setDisplaySize(50, 50);
        this.player.setSize(50, 50);
        this.player.setRotation(Phaser.Math.DegToRad(270))
        this.player.setImmovable(true)
        this.player.body.allowDrag = true
        this.player.body.allowGravity = false
        this.player.setCollideWorldBounds(true)
        this.target = this.physics.add.image(sizes.width / 2, 100, "hotdog").setOrigin(0, 0)

        // [target]
        this.target.setMaxVelocity(0, speedDown)
        this.target.setCollideWorldBounds(true)
        this.target.setBounce(1)

        // [collision]
        this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

        // [score]
        this.scoreText = this.add.text(sizes.width - 20, 20, `Score: ${this.points}`, {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(1, 0);

        // [controls]
        this.cursor = this.input.keyboard.createCursorKeys()
    }

    update() {
        if (this.target.y >= sizes.height) {
            this.target.setY(0)
            this.target.x = getRandomX()
        }

        const { up, down, left, right } = this.cursor
        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed)
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed)
        } else {
            this.player.setVelocityX(0)
        }
    }
    targetHit = () => {
        this.target.setY(0)
        this.target.setX(getRandomX())
        this.points++
        this.scoreText.setText(`Score: ${this.points}`); // Update the score text

    }
}
const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: document.getElementById('gameCanvas'),
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gravity },
            debug: true,
            fps: 120
        },
    },
    scene: [GameScene]
}
const getRandomX = () => {
    return Math.floor(Math.random() * 500)
}

const game = new Phaser.Game(config)


