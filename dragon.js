class Dragon {
  constructor(image, x, y, size, speed, textureMap) {
    this.image = image;
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.size = size;
    this.speed = speed;
    this.textureMap = textureMap;
  }

  move(target) {
    let targetX = target.x;
    let targetY = target.y;

    // Calculate direction towards the target
    let dx = targetX - this.x;
    let dy = targetY - this.y;

    // Move towards the target
    if (dx !== 0 || dy !== 0) {
      let angle = atan2(dy, dx);
      let newX = this.x + cos(angle) * this.speed;
      let newY = this.y + sin(angle) * this.speed;

      // Check if the next position is a crystal tile
      let nextTileX = floor(newX / tileSize);
      let nextTileY = floor(newY / tileSize);
      if (this.textureMap[nextTileY][nextTileX] === 1) {
        // If the next position is a crystal tile, try to find an alternative path
        let alternatives = [
          { x: nextTileX + 1, y: nextTileY }, // Right
          { x: nextTileX - 1, y: nextTileY }, // Left
          { x: nextTileX, y: nextTileY + 1 }, // Down
          { x: nextTileX, y: nextTileY - 1 }, // Up
        ];

        for (let alt of alternatives) {
          if (this.textureMap[alt.y][alt.x] !== 1) {
            newX = alt.x * tileSize;
            newY = alt.y * tileSize;
            break;
          }
        }
      }

      this.x = newX;
      this.y = newY;
    }
  }

  display() {
    image(this.image, this.x, this.y, this.size, this.size);
  }

  debug(isON) {
    if (isON) {
      stroke(0);
      fill(0, 0, 0, 100);
      rect(this.x + 2, this.y + 2, this.size - 4, this.size - 4);
    }
  }
}
