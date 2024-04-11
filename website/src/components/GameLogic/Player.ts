import Game from "./Game"
import type { Position } from "./GameType";
import GameEntity from "./GameEntity";
import Projectile from "./Projectile";

export default class Player extends GameEntity {

    // Player username
    username: string = "";
    basePosition: Position;
    projectiles: Projectile[] = []

    constructor(game: Game, spaceship: any) {
        super(game, spaceship.image)

        // Create base position for future reset
        this.basePosition = {
            x: window.width / 2,
            y: window.height - 30
        }

        this.position = { ...this.basePosition };

        this.speed = spaceship.speed;
        this.lives = spaceship.lives;
    }

    // When the player press a touch, it will go here to be properly redirected
    onKeyPressed(keyCode: number) {
        const [
            left,   // A
            right,  // D
            up,     // W
            down,   // S
            pause,  // Escape
            shoot   // B
        ] = [
                65, // A
                68, // D
                87, // W
                83, // S
                27, // Escape
                66  // B
            ];

        if (keyCode === pause) {
            this.game.interaction.togglePause();
            if (!this.game.state.isStarted) {
                this.game.interaction.startGame();
            }
        }

        if (this.lives <= 0) return;

        // Do not allow any other key press if the game is paused
        if (this.game.state.isPaused || this.game.state.isFinished || !this.game.state.isStarted) return
        switch (keyCode) {
            case right:
                this.moveRight();
                break;
            case left:
                this.moveLeft();
                break;
            case up:
                this.moveUp();
                break;
            case down:
                this.moveDown();
                break;
            case shoot:
                this.launchProjectile();
                break;
            default:
                break;
        }
    }

    launchProjectile() {
        if (this.projectiles.length < this.game.config.maxProjectileOnScreenPlayer) {

            const projectileNFT = window.gameInfo.inventory.projectiles.find((e: any) => e.selected)
            const projectile = new Projectile(this.game, projectileNFT.gameImage, this, projectileNFT)
            this.projectiles.push(projectile)
        }
    }

    checkProjectileCollision() {
        // Loop into all projectiles
        this.projectiles.forEach((projectile, i) => {
            // Loop into all enemies
            this.game.levels[this.game.currentLevel].enemies.forEach((enemy, j) => {
                if (this.game.checkCollision(enemy, projectile)) {
                    projectile.isAttacked(1)
                    enemy.isAttacked(projectile.damage)
                }
            })
        })
    }
    checkPlayerCollision() {
        // Loop into all enemies
        this.game.levels[this.game.currentLevel].enemies.forEach((enemy, j) => {
            if (this.game.checkCollision(enemy, this)) {
                console.log(this.lives)
                this.isAttacked(1)

            }
        })
    }

    resetPosition() {
        this.position = { ...this.basePosition }
        this.isMovingDown = false;
        this.isMovingUp = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    isAttacked(damage: number) {
        super.isAttacked(damage)

        if (this.lives <= 0) {
            this.game.state.isFinished = true
            this.game.drawGameOver()
        }

        this.resetPosition()
    }

    draw() {
        super.draw()
        // Draw projectiles
        this.projectiles.forEach((projectile, i) => {
            const res = projectile.draw()

            if (res.delete) {
                this.projectiles.splice(i, 1)
            }
        });

        this.checkPlayerCollision();
        this.checkProjectileCollision();

        return { delete: false }
    }
}