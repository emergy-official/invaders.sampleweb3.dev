import Player from "./Player"
import GameState from "./GameState"
import GameLevel from "./GameLevel"
import GameInteraction from "./GameInteraction"
import type Projectile from "./Projectile";
import type { GameConfig, Position } from "./GameType";
import type Enemy from "./Enemy";
import type GameEntity from "./GameEntity";
import { getRandomElement } from "../helpers";

export default class Game {

    player: Player;
    levels: GameLevel[];

    currentLevel: number;

    interaction: GameInteraction;

    // GameState
    state: GameState;

    gameEventInterval: NodeJS.Timeout;

    config: GameConfig = {
        backgroundColor: "#13151a",
        playerSkin: "/images/spaceship_1.png",
        defaultEnemySkin: "/images/red_invader_128.png",

        projectilePlayerSkin: "/images/projectile_3.png",
        projectileEnemySkin: "/images/projectile_enemy.png",

        maxProjectileOnScreenPlayer: 10,
        maxProjectileOnScreenEnemy: 5,
    };

    constructor() {

        const spaceshipNFT = window.gameInfo.inventory.spaceships.find((e: any) => e.selected)

        this.player = new Player(this, spaceshipNFT)

        this.levels = [
            new GameLevel(this, 1),
            new GameLevel(this, 2),
            new GameLevel(this, 3),
        ]
        this.currentLevel = 0
        this.interaction = new GameInteraction(this);
        this.state = new GameState(this);

        this.gameEventInterval = setInterval(this.launchGameEvent.bind(this), 500)

        // setTimeout(() => {
        //     this.interaction.levelUp()
        // }, 2000)
        // if(window.innerWidth < 1280 || window.inne"rHeight < 600) {
        //     window.alert("The game works at best with a screen resolution of at least 1280x600")
        // }"


        this.drawStartGame()
        // this.drawWinGame()
        // this.drawGameOver()
    }

    drawStartGame() {
        window.background(this.config.backgroundColor)

        let txt0 = "LVL 1"

        let txt1 = "press ESCAPE to start or pause the game"
        let txt2 = "press W,A,S,D to move the spaceship"
        let txt3 = "press B to launch a projectile"
        const y1 = 80

        // let textXpos1 = width / 2 - textWidth(startText1) / 2;
        window.fill(255)
        window.textFont("Silkscreen")
        window.textSize(30)
        window.text(txt0, window.width / 2 - window.textWidth(txt0) / 2, y1)
        window.textSize(20)

        window.text(txt1, window.width / 2 - window.textWidth(txt1) / 2, y1 + 60)
        window.text(txt2, window.width / 2 - window.textWidth(txt2) / 2, y1 + 100)
        window.text(txt3, window.width / 2 - window.textWidth(txt3) / 2, y1 + 140)
    }

    drawGameOver() {
        setTimeout(() => {

            window.background(this.config.backgroundColor)

            let txt0 = "YOU LOST"

            let txt1 = "Try again!"
            let txt2 = "Restart by clicking on any spaceships"
            let txt3 = " or projectiles below!"

            const y1 = 80

            // let textXpos1 = width / 2 - textWidth(startText1) / 2;
            window.fill(255)
            window.textFont("Silkscreen")
            window.textSize(30)
            window.text(txt0, window.width / 2 - window.textWidth(txt0) / 2, y1)
            window.textSize(20)

            window.text(txt1, window.width / 2 - window.textWidth(txt1) / 2, y1 + 60)
            window.text(txt2, window.width / 2 - window.textWidth(txt2) / 2, y1 + 100)
            window.text(txt3, window.width / 2 - window.textWidth(txt3) / 2, y1 + 140)

        }, 20)
    }

    drawWinGame() {
        window.background(this.config.backgroundColor)

        let txt0 = "YOU WON!"

        let txt1 = "Congrats on winning the game!"
        let txt2 = "Restart by clicking on any spaceships"
        let txt3 = "or projectiles below!"
        const y1 = 80

        // let textXpos1 = width / 2 - textWidth(startText1) / 2;
        window.fill(255)
        window.textFont("Silkscreen")
        window.textSize(30)
        window.text(txt0, window.width / 2 - window.textWidth(txt0) / 2, y1)
        window.textSize(20)

        window.text(txt1, window.width / 2 - window.textWidth(txt1) / 2, y1 + 60)
        window.text(txt2, window.width / 2 - window.textWidth(txt2) / 2, y1 + 100)
        window.text(txt3, window.width / 2 - window.textWidth(txt3) / 2, y1 + 140)
    }

    drawPause() {

        let txt0 = "GAME PAUSED"
        let txt1 = "press ESCAPE to start or pause the game"
        let txt2 = "press W,A,S,D to move the spaceship"
        let txt3 = "press B to launch a projectile"

        window.background("#13151ae0")

        // let textXpos1 = width / 2 - textWidth(startText1) / 2;
        window.fill(255)
        window.textFont("Silkscreen")
        window.textSize(30)

        const y1 = 80
        window.text(txt0, window.width / 2 - window.textWidth(txt0) / 2, y1)
        window.textSize(20)

        window.text(txt1, window.width / 2 - window.textWidth(txt1) / 2, y1 + 60)
        window.text(txt2, window.width / 2 - window.textWidth(txt2) / 2, y1 + 100)
        window.text(txt3, window.width / 2 - window.textWidth(txt3) / 2, y1 + 140)
    }

    draw() {
        if (this.state.isPaused || !this.state.isStarted || this.state.isFinished) return
        window.background(this.config.backgroundColor)

        this.drawGameData()
        // Draw player
        this.player.draw()

        this.levels[this.currentLevel].draw()
    }

    drawGameData() {
        let txt0 = window.gameInfo.userInfo.username
        let txt1 = `Lives: ${this.player.lives}`
        let txt2 = `Level: ${this.currentLevel + 1}`

        // let textXpos1 = width / 2 - textWidth(startText1) / 2;
        window.fill(255)
        window.textFont("Silkscreen")
        window.textSize(18)

        window.text(txt0, 20, 20)
        window.text(txt1, window.width - window.textWidth(txt1) - 20, 20)
        window.text(txt2, window.textWidth(txt0) + 60, 20)
    }

    checkCollision(entityA: GameEntity, entityB: GameEntity) {

        if (!entityA.lives || !entityB.lives) return

        const entityAStartX = entityA.position.x
        const entityAEndX = entityA.position.x + entityA.radius * 2

        const entityAStartY = entityA.position.y
        const entityAEndY = entityA.position.y + entityA.radius * 2

        const entityBStartX = entityB.position.x
        const entityBEndX = entityB.position.x + entityB.radius * 2

        const entityBStartY = entityB.position.y
        const entityBEndY = entityB.position.y + entityB.radius * 2

        const hasTouchedX = entityBEndX >= entityAStartX && entityBStartX <= entityAEndX;
        const hasTouchedY = entityBEndY >= entityAStartY && entityBStartY <= entityAEndY;

        return hasTouchedX && hasTouchedY
    }

    launchGameEvent() {
        if (!(this.state.isStarted && !this.state.isFinished)) return
        if (this.state.isPaused) return

        // Select a random enemy
        const enemy = getRandomElement(this.levels[this.currentLevel].enemies)

        // Launch a projectile from this enemy
        enemy.launchProjectile()
    }

}