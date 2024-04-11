function draw() {
  // window.p5Data.draw()
  if (window?.gameInfo?.game) {
    window.gameInfo.game.draw();
  }
}
function keyPressed() {
  // window.p5Data.keyPressed();

  if (window?.gameInfo?.game?.player) {
    window.gameInfo.game.player.onKeyPressed(window.keyCode);
  }
}

function preload() {
  const alien = window.loadImage("/images/blue_invader_128.png");
  const shooter = window.loadImage("/images/projectile_1.png");
  const upgradedShooter = window.loadImage("/images/spaceship_1.png");

  window.p5Data = {};

  window.p5Data.draw = () => {};
  window.p5Data.keyPressed = () => {};

  window.p5Data.images = {
    blue_invader: window.loadImage("/images/blue_invader_128.png"),
    red_invader: window.loadImage("/images/red_invader_128.png"),
    orange_invader: window.loadImage("/images/orange_invader_128.png"),

    projectile_1: window.loadImage("/images/projectile_1.png"),
    projectile_2: window.loadImage("/images/projectile_2.png"),
    projectile_3: window.loadImage("/images/projectile_3.png"),

    spaceship_1: window.loadImage("/images/spaceship_1.png"),
    spaceship_2: window.loadImage("/images/spaceship_2.png"),
    spaceship_3: window.loadImage("/images/spaceship_3.png"),
  };
}
