import Game from "./Game"
import type { Position } from "./GameType";
import GameEntity from "./GameEntity";
import Projectile from "./Projectile";

export default class Enemy extends GameEntity {
    projectiles: Projectile[] = []

    constructor(game: Game, skinURL: string) {
        super(game, skinURL);
    }

    draw() {
        const res = super.draw()
        if (res.delete) {
            return res
        }

        // Draw projectiles
        this.projectiles.forEach((projectile, i) => {
            const res = projectile.draw()

            if (res.delete) {
                this.projectiles.splice(i, 1)
            }
        });
        this.checkProjectileCollision()
        return { delete: false }
    }

    launchProjectile() {
        if (this.projectiles.length < this.game.config.maxProjectileOnScreenEnemy) {
            const projectile = new Projectile(this.game, this.game.config.projectileEnemySkin, this)
            projectile.isMovingUp = false
            projectile.isMovingDown = true
            projectile.position.y += (this.radius * 2)
            this.projectiles.push(projectile)
        }
    }

    updateDirection() {
        super.updateDirection()
        if (this.position.x > window.width - 50) {
            console.log("EA")
            this.isMovingRight = false
            this.isMovingLeft = true
        }
        if (this.position.x < 50) {
            this.isMovingRight = true
            this.isMovingLeft = false
        }
    }

    checkProjectileCollision() {
        // Loop into all projectiles
        this.projectiles.forEach((projectile, i) => {
            // Loop into all enemies
            if (this.game.checkCollision(this.game.player, projectile)) {
                projectile.isAttacked(1)
                this.game.player.isAttacked(projectile.damage)
            }
        })
    }

}