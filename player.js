class Player {
  constructor(sprites, startAcross, startDown, size, speed, tileRules) {
    this.sprites = sprites;
    this.across = startAcross;
    this.down = startDown;
    this.x = this.across * size;
    this.y = this.down * size;
    this.size = size; // Added size parameter
    this.speed = speed;
    this.tileRules = tileRules;
    this.dirX = 0;
    this.dirY = 0;
    this.isMoving = false;
    this.tX = this.x;
    this.tY = this.y;
  };

  setDirection() {
    if (!this.isMoving) {
      if (key === "w") {
        this.dirX = 0;
        this.dirY = -1;
      } else if (key === "s") {
        this.dirX = 0;
        this.dirY = 1;
      } else if (key === "a") {
        this.dirX = -1;
        this.dirY = 0;
      } else if (key === "d") {
        this.dirX = 1;
        this.dirY = 0;
      }
      this.checkTargetTile();
    }
  }

  checkTargetTile() {
    this.across = floor(this.x / this.tileSize);
    this.down = floor(this.y / this.tileSize);

    let nextTileHorizontal = this.across + this.dirX;
    let nextTileVertical = this.down + this.dirY;

    if (
      nextTileHorizontal >= 0 &&
      nextTileHorizontal < mapSize &&
      nextTileVertical >= 0 &&
      nextTileVertical < mapSize
    ) {
      if (this.tileRules[nextTileVertical][nextTileHorizontal] != 1) {
        this.tX = nextTileHorizontal * this.size;
        this.tY = nextTileVertical * this.size;
        this.isMoving = true;
      }
    }
  }

  move() {
    // Move player
    if (this.isMoving) {
      this.x += this.speed * this.dirX;
      this.y += this.speed * this.dirY;

      if (this.x === this.tX && this.y === this.tY) {
        this.isMoving = false;
        this.dirX = 0;
        this.dirY = 0;
      }
    }
  }

  display() {
    // Display player sprite
    image(this.sprites, this.x, this.y, this.size, this.size);
  }


  debug(isON) {
    if (isON) {
      stroke(245);
      noFill();
      rect(this.x, this.y, this.tileSize, this.tileSize);
    }
  }

}

