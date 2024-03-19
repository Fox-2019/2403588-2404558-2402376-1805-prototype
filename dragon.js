class Dragon {
  constructor(image, x, y, size, speed, textureMap) {
    this.image = image;
    this.x = x * size;
    this.y = y * size;
    this.size = size;
    this.speed = speed;
    this.freezeMultiplier = 0;
    this.damage = 1.1;
    this.textureMap = textureMap;
  }

  move(target) {
    //if the slowdown is set to 0, it means the dragon is frozen
    if (this.freezeMultiplier < 1) {
      this.freezeMultiplier += 0.002;
    }

    // Calculate direction towards the target
    let dx = target.x - this.x;
    let dy = target.y - this.y;

    // Move towards the target
    if (dx !== 0 || dy !== 0) {
      let angle = atan2(dy, dx);
      let newX = this.x + cos(angle) * this.speed * this.freezeMultiplier;
      let newY = this.y + sin(angle) * this.speed * this.freezeMultiplier;

      // Check if the next position is a crystal tile
      let nextTileX = floor(newX / tileSize);
      let nextTileY = floor(newY / tileSize);

      this.x = newX;
      this.y = newY;
    }
    //if the the enemy moves into the target, deal damage taking in consideration the freeze effect
    if (abs(dx) < this.size && abs(dy) < this.size)
      player.damage(this.damage * this.freezeMultiplier);
  }

  dragonFreeze() {
    this.freezeMultiplier = 0;
  }

  display() {
    push();
    tint(255, map(this.freezeMultiplier, 0, 1, 100, 255));
    image(this.image.dragon, this.x, this.y, this.size, this.size);

    tint(255, map(this.freezeMultiplier, 0, 1, 255, 0));
    image(this.image.pinky, this.x, this.y, this.size, this.size);
    pop();
  }

  debug(isON) {
    if (isON) {
      push();
      stroke(0);
      fill(0, 0, 0, 100);
      rect(this.x + 2, this.y + 2, this.size - 4, this.size - 4);
      pop();
    }
  }
}
