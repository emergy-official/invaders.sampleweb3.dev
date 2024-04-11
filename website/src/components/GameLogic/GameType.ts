export interface Position {
    x: number;
    y: number;
}

export interface GameConfig {
    backgroundColor: string;
    playerSkin: string;
    defaultEnemySkin: string;

    projectilePlayerSkin: string;
    projectileEnemySkin: string;

    maxProjectileOnScreenPlayer: number;
    maxProjectileOnScreenEnemy: number;
}
export interface DrawGameEntity {
    delete: boolean
}