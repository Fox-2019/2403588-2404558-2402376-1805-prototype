class Dragon {
  constructor(image, x, y, size, speed, textureMap) {
    this.image = image;
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.size = size;
    this.speed = speed;
    this.slowdownMultiplier = 0;
    this.textureMap = textureMap;
  }

  move(target) {
    //if the slowdown is set to 0
    if (this.slowdownMultiplier < 1) {
      this.slowdownMultiplier += 0.002;
    }

    // Calculate direction towards the target
    let dx = target.x - this.x;
    let dy = target.y - this.y;

    // Move towards the target
    if (dx !== 0 || dy !== 0) {
      let angle = atan2(dy, dx);
      let newX = this.x + cos(angle) * this.speed * this.slowdownMultiplier;
      let newY = this.y + sin(angle) * this.speed * this.slowdownMultiplier;

      // Check if the next position is a crystal tile
      let nextTileX = floor(newX / tileSize);
      let nextTileY = floor(newY / tileSize);

      this.x = newX;
      this.y = newY;
    }
  }
  dragonFreeze() {
    this.slowdownMultiplier = 0;
  }

  display() {
    image(this.image, this.x, this.y, this.size, this.size);
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
