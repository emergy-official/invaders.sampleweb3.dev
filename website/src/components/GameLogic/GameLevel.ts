import Enemy from "./Enemy";
import Game from "./Game"

export default class GameLevel {
    game: Game;

    lvl: number;
    enemies: Enemy[] = [];

    constructor(game: Game, lvl: number) {
        this.game = game
        this.lvl = lvl
        this.generateLevel();
    }

    generateLevel() {
        switch (this.lvl) {
            case 1:
                this.generateLevelOne();
                break;
            case 2:
                this.generateLevelTwo();
                break;
            case 3:
                this.generateLevelThree();
                break;
        }
    }

    draw() {
        this.enemies.forEach((enemy, i) => {
            const res = enemy.draw()

            if (res.delete) {
                this.enemies.splice(i, 1)
            }
        });

        if (!this.enemies.length) {
            this.game.interaction.levelUp()
        }
    }


    generateLevelOne() {

        const spaceBetweenEntities = 30;
        this.enemies.push(
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),


            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),

        )

        this.enemies[0].position = {
            x: window.width / 2,
            y: 30
        }

        this.enemies[1].position = {
            x: this.enemies[0].position.x - (this.enemies[0].radius * 2) - spaceBetweenEntities,
            y: this.enemies[0].position.y
        }
        this.enemies[2].position = {
            x: this.enemies[0].position.x + (this.enemies[0].radius * 2) + spaceBetweenEntities,
            y: this.enemies[0].position.y
        }

        this.enemies[3].position = { ...this.enemies[0].position, x: this.enemies[0].position.x - ((this.enemies[0].radius * 2) - spaceBetweenEntities) * 3 }
        this.enemies[4].position = { ...this.enemies[0].position, x: this.enemies[0].position.x + ((this.enemies[0].radius * 2) - spaceBetweenEntities) * 3 }

        this.enemies[3].isMovingLeft = true
        this.enemies[4].isMovingRight = true

        this.enemies[5].position = {
            x: window.width / 2,
            y: 80
        }

        this.enemies[6].position = { ...this.enemies[5].position, x: this.enemies[5].position.x - (this.enemies[5].radius * 2) - spaceBetweenEntities }
        this.enemies[7].position = { ...this.enemies[5].position, x: this.enemies[5].position.x + (this.enemies[0].radius * 2) + spaceBetweenEntities }
        this.enemies[8].position = { ...this.enemies[5].position, x: this.enemies[5].position.x - ((this.enemies[0].radius * 2) + spaceBetweenEntities) * 2 }
        this.enemies[9].position = { ...this.enemies[5].position, x: this.enemies[5].position.x + ((this.enemies[0].radius * 2) + spaceBetweenEntities) * 2 }
    }

    generateLevelTwo() {
        const spaceBetweenEntities = 30;
        this.enemies.push(
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),

            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),

            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),

        )

        this.enemies[0].position = {
            x: window.width / 2,
            y: 120
        }


        const positionCalc = (this.enemies[0].radius * 2) + spaceBetweenEntities

        this.enemies[1].position = { x: this.enemies[0].position.x - positionCalc, y: 100 }
        this.enemies[2].position = { x: this.enemies[0].position.x + positionCalc, y: 100 }
        this.enemies[3].position = { x: this.enemies[0].position.x - positionCalc * 2, y: 80 }
        this.enemies[4].position = { x: this.enemies[0].position.x + positionCalc * 2, y: 80 }
        this.enemies[5].position = { x: this.enemies[0].position.x - positionCalc * 3, y: 60 }
        this.enemies[6].position = { x: this.enemies[0].position.x + positionCalc * 3, y: 60 }
        this.enemies[7].position = { x: this.enemies[0].position.x - positionCalc * 4, y: 40 }
        this.enemies[8].position = { x: this.enemies[0].position.x + positionCalc * 4, y: 40 }

        this.enemies[9].position = { ...this.enemies[0].position, y: 60 }
        this.enemies[10].position = { ...this.enemies[9].position, x: this.enemies[9].position.x - positionCalc, y: 40 }
        this.enemies[11].position = { ...this.enemies[9].position, x: this.enemies[9].position.x + positionCalc, y: 40 }

        this.enemies[12].position = { x: this.enemies[0].position.x, y: 20 }
        this.enemies[12].isMovingRight = true

        this.enemies[13].position = { x: this.enemies[0].position.x + positionCalc, y: 20 }
        this.enemies[13].isMovingRight = true

        this.enemies[14].position = { x: this.enemies[0].position.x - positionCalc, y: 20 }
        this.enemies[14].isMovingLeft = true

        this.enemies[15].position = { x: this.enemies[0].position.x, y: 20 }
        this.enemies[15].isMovingLeft = true

    }
    generateLevelThree() {
        const spaceBetweenEntities = 30;
        this.enemies.push(
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),
            new Enemy(this.game, "/images/orange_invader_128.png"),

            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),
            new Enemy(this.game, "/images/blue_invader_128.png"),

            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
            new Enemy(this.game, "/images/red_invader_128.png"),
        )

        this.enemies[0].position = {
            x: window.width / 2,
            y: 120
        }
        const positionCalc = (this.enemies[0].radius * 2) + spaceBetweenEntities
        this.enemies[1].position = { ...this.enemies[0].position, x: this.enemies[0].position.x - positionCalc }
        this.enemies[2].position = { ...this.enemies[0].position, x: this.enemies[0].position.x - positionCalc * 2 }
        this.enemies[3].position = { ...this.enemies[0].position, x: this.enemies[0].position.x - positionCalc * 3 }
        this.enemies[4].position = { ...this.enemies[0].position, x: this.enemies[0].position.x - positionCalc * 4 }

        this.enemies[5].position = { ...this.enemies[0].position, x: this.enemies[0].position.x + positionCalc }
        this.enemies[6].position = { ...this.enemies[0].position, x: this.enemies[0].position.x + positionCalc * 2 }
        this.enemies[7].position = { ...this.enemies[0].position, x: this.enemies[0].position.x + positionCalc * 3 }
        this.enemies[8].position = { ...this.enemies[0].position, x: this.enemies[0].position.x + positionCalc * 4 }


        this.enemies[9].position = {
            x: window.width / 2,
            y: 80
        }
        this.enemies[9].isMovingRight = true;

        this.enemies[10].position = { ...this.enemies[9].position, x: this.enemies[9].position.x + positionCalc }
        this.enemies[10].isMovingRight = true;

        this.enemies[11].position = { ...this.enemies[9].position, x: this.enemies[9].position.x + positionCalc * 2 }
        this.enemies[11].isMovingRight = true;

        this.enemies[12].position = { ...this.enemies[9].position, x: this.enemies[9].position.x + positionCalc * 3 }
        this.enemies[12].isMovingRight = true;

        this.enemies[13].position = { ...this.enemies[9].position, x: this.enemies[9].position.x + positionCalc * 4 }
        this.enemies[13].isMovingRight = true;

        this.enemies[14].position = { ...this.enemies[9].position, x: this.enemies[9].position.x - positionCalc }
        this.enemies[14].isMovingLeft = true;

        this.enemies[15].position = { ...this.enemies[9].position, x: this.enemies[9].position.x - positionCalc * 2 }
        this.enemies[15].isMovingLeft = true;

        this.enemies[16].position = { ...this.enemies[9].position, x: this.enemies[9].position.x - positionCalc * 3 }
        this.enemies[16].isMovingLeft = true;

        this.enemies[17].position = { ...this.enemies[9].position, x: this.enemies[9].position.x - positionCalc * 4 }
        this.enemies[17].isMovingLeft = true;

        this.enemies[18].position = {
            x: window.width / 2,
            y: 40
        }
        this.enemies[18].isMovingLeft = true;

        this.enemies[19].position = { ...this.enemies[18].position, x: this.enemies[18].position.x + positionCalc }
        this.enemies[19].isMovingLeft = true;

        this.enemies[20].position = { ...this.enemies[18].position, x: this.enemies[18].position.x + positionCalc * 2 }
        this.enemies[20].isMovingLeft = true;

        this.enemies[21].position = { ...this.enemies[18].position, x: this.enemies[18].position.x + positionCalc * 3 }
        this.enemies[21].isMovingLeft = true;

        this.enemies[22].position = { ...this.enemies[18].position, x: this.enemies[18].position.x + positionCalc * 4 }
        this.enemies[22].isMovingLeft = true;

        this.enemies[23].position = { ...this.enemies[18].position, x: this.enemies[18].position.x - positionCalc }
        this.enemies[23].isMovingRight = true;

        this.enemies[24].position = { ...this.enemies[18].position, x: this.enemies[18].position.x - positionCalc * 2 }
        this.enemies[24].isMovingRight = true;

        this.enemies[25].position = { ...this.enemies[18].position, x: this.enemies[18].position.x - positionCalc * 3 }
        this.enemies[25].isMovingRight = true;

        this.enemies[26].position = { ...this.enemies[18].position, x: this.enemies[18].position.x - positionCalc * 4 }
        this.enemies[26].isMovingRight = true;


    }
}