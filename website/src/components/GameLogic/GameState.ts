import Game from "./Game"


export default class GameState {

    game: Game;

    // Game score
    score: number = 0;

    // Determine if the player has started the game
    // Will display the first screen if not
    isStarted: boolean = false;

    // When the game is paused, is will display the information screen (how to play)
    isPaused: boolean = true;

    // When the game has been fully finished (last level)
    isFinished: boolean = false;

    constructor(game: Game) {
        this.game = game
    }


}