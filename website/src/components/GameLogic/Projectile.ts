import type Enemy from "./Enemy";
import Game from "./Game"
import GameEntity from "./GameEntity";
import type { Position } from "./GameType";
import type Player from "./Player";

export interface ProjectileAttribut {
    damage: number;
    speed: number;
    lives: number;
    number: number;
}

export default class Projectile extends GameEntity {

    damage: number = 1;
    number: number = 1;

    projectiles: Projectile[];

    constructor(game: Game, skinURL: string, owner: Player | Enemy, attributs?: ProjectileAttribut) {
        super(game, skinURL);
        this.radius = 5;

        this.position.x = owner.position.x + owner.radius
        this.position.y = owner.position.y

        this.isMovingUp = true;
        this.speed = 2.5

        if (attributs) {
            if (attributs.damage) {
                this.damage = attributs.damage
            }

            if (attributs.speed) {
                this.speed = attributs.speed
            }

            if (attributs.lives) {
                this.lives = attributs.lives
            }

            if (attributs.number) {
                this.number = attributs.number
            }

        }
        this.projectiles = [];

        if (this.number === 3) {
            const projectile2 = new Projectile(game, skinURL, owner)
            projectile2.speed = attributs?.speed ? attributs.speed : this.speed;
            projectile2.position.x -= 20
            projectile2.position.y += 5

            const projectile3 = new Projectile(game, skinURL, owner)
            projectile3.speed = attributs?.speed ? attributs.speed : this.speed;
            projectile3.position.x += 20
            projectile3.position.y += 5

            this.game.player.projectiles.push(projectile2)
            this.game.player.projectiles.push(projectile3)
        }

        if (this.number === 5) {
            const projectile2 = new Projectile(game, skinURL, owner)
            projectile2.speed = attributs?.speed ? attributs.speed : this.speed;
            projectile2.position.x -= 20
            projectile2.position.y += 5

            const projectile3 = new Projectile(game, skinURL, owner)
            projectile3.speed = attributs?.speed ? attributs.speed : this.speed;
            projectile3.position.x += 20
            projectile3.position.y += 5

            const projectile4 = new Projectile(game, skinURL, owner)
            projectile4.speed = attributs?.speed ? attributs.speed : this.speed;
            projectile4.isMovingLeft = true

            const projectile5 = new Projectile(game, skinURL, owner)
            projectile5.speed = attributs?.speed ? attributs.speed : this.speed;
            projectile5.isMovingRight = true

            this.game.player.projectiles.push(projectile2)
            this.game.player.projectiles.push(projectile3)
            this.game.player.projectiles.push(projectile4)
            this.game.player.projectiles.push(projectile5)
        }

    }

    updateDirection() {
        if (this.isMovingRight) {
            this.position.x += 0.3 * this.speed;
        } else if (this.isMovingLeft) {
            this.position.x -= 0.3 * this.speed;
        }

        if (this.isMovingUp) {
            this.position.y -= 1 * this.speed;
        } else if (this.isMovingDown) {
            this.position.y += 1 * this.speed;
        }
    }

    draw() {
        const res = super.draw();
        if (res.delete) {
            return res
        };
        const size = (this.radius * 2)
        if (
            this.position.x < 0 - size
            || this.position.x > window.width + size
            || this.position.y < 0 - size
            || this.position.y > window.height + size) {
            return { delete: true }
        } else {
            return { delete: false }
        }
    }
}