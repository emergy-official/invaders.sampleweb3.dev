import Game from "./Game"

export default class GameInteraction {

    game: Game;
    constructor(game: Game) {
        this.game = game
    }

    // When the player press a 
    togglePause() {
        if(this.game.state.isFinished) return
        this.game.state.isPaused = !this.game.state.isPaused;
        if(this.game.state.isPaused) {
            this.game.drawPause()
        }
    }

    // When the player press a 
    startGame() {
        this.game.state.isStarted = true;
    }

    // When the player press a 
    levelUp() {
        if (this.game.currentLevel >= this.game.levels.length - 1) {
            this.game.state.isFinished = true
            this.game.drawWinGame()
            return;
        }

        this.game.player.resetPosition()
        this.game.player.projectiles = []
        // Move to the next level
        this.game.currentLevel += 1

        if(this.game.currentLevel == 1) {
            clearInterval(this.game.gameEventInterval)
            this.game.gameEventInterval = setInterval(this.game.launchGameEvent.bind(this.game), 500)
        }

        if(this.game.currentLevel == 2) {
            clearInterval(this.game.gameEventInterval)
            this.game.gameEventInterval = setInterval(this.game.launchGameEvent.bind(this.game), 200)
        }
    }

}