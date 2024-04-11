import Game from "./Game"
import type { DrawGameEntity, Position } from "./GameType";

export default class GameEntity {

    game: Game;
    lives: number = 1;

    // Player skin
    skinURL: string = "";
    skinImage: string = "";

    position: Position = { x: 0, y: 0 };
    radius: number = 20;
    speed: number = 1;

    isMovingRight: boolean = false;
    isMovingLeft: boolean = false;

    isMovingUp: boolean = false;
    isMovingDown: boolean = false;

    constructor(game: Game, skinURL: string) {
        this.game = game

        this.skinURL = skinURL
        this.preloadSkinImage()
    }

    // The basic function to draw
    draw(): DrawGameEntity {
        if (this.lives <= 0) {
            return { delete: true }
        }

        window.image(this.skinImage, this.position.x, this.position.y, this.radius * 2, this.radius * 2);
        this.updateDirection()

        return { delete: false }
    }

    preloadSkinImage() {
        this.skinImage = window.loadImage(this.skinURL)
    }

    moveLeft() {
        this.isMovingRight = false;
        this.isMovingLeft = true;
    }

    moveRight() {
        this.isMovingLeft = false;
        this.isMovingRight = true;
    }

    moveUp() {
        this.isMovingUp = true;
        this.isMovingDown = false;
    }

    moveDown() {
        this.isMovingUp = false;
        this.isMovingDown = true;
    }

    // Change player position
    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.x = y;
    }

    // Change entity speed
    setSpeed(speed: number) {
        this.speed = speed;
    }

    // Change the entity skin
    setSkinURL(url: string) {
        this.skinURL = url;
        this.preloadSkinImage()
    }


    isAttacked(damage:number) {
        this.lives -= damage
    }

    updateDirection() {
        if (this.isMovingRight && this.position.x < window.width - 40) {
            this.position.x += 1 * this.speed;
        } else if (this.isMovingLeft && this.position.x > 0) {
            this.position.x -= 1 * this.speed;
        }

        if (this.isMovingUp && this.position.y > 0) {
            this.position.y -= 1 * this.speed;
        } else if (this.isMovingDown && this.position.y < window.height - 30) {
            this.position.y += 1 * this.speed;
        }
    }
}