class Player {
  constructor(sprites, startAcross, startDown, size, speed, tileRules) {
    this.sprites = sprites;
    // this.currentSprite = this.sprites.right;
    this.across = startAcross;
    this.down = startDown;
    this.x = this.across * size;
    this.y = this.down * size;
    this.tileSize = size;
    this.speed = speed;
    this.tileRules = tileRules;
    this.dirX = 0;
    this.dirY = 0;
    this.isMoving = false;
    this.tX = this.x;
    this.tY = this.y;
  }
    //Player Interactipn with collectible.
    intersects(collectible) {
        let d = dist(this.x, this.y, collectible.x, collectible.y);
        return d < this.size / 2 + collectible.size / 2;
}
  
  }

  setDirection(); {
    if (!this.isMoving) {
      if (key === "w") {
        this.dirX = 0;
        this.dirY = -1;
        // this.currentSprite = this.sprites.up;
      }

      if (key === "s") {
        this.dirX = 0;
        this.dirY = 1;
        // this.currentSprite = this.sprites.down;
      }

      if (key === "a") {
        this.dirX = -1;
        this.dirY = 0;
        // this.currentSprite = this.sprites.left;
      }

      if (key === "d") {
        this.dirX = 1;
        this.dirY = 0;
        // this.currentSprite = this.sprites.right;
      }

      this.checkTargetTile();
    }
  }

  checkTargetTile(); {
    this.across = floor(this.x / this.tileSize);
    this.down = floor(this.y / this.tileSize);

    let nextTileHorizontal = this.across + this.dirX;
    let nextTileVertical = this.down + this.dirY;

    //check if tile within map
    if (
      nextTileHorizontal >= 0 &&
      nextTileHorizontal < mapSize &&
      nextTileVertical >= 0 &&
      nextTileVertical < mapSize
    ) {
      //if it is, check if targetTile walkable
      if (this.tileRules[nextTileVertical][nextTileHorizontal] != 1) {
        this.tX = nextTileHorizontal * this.tileSize;
        this.tY = nextTileVertical * this.tileSize;

        camera.moveIfOffscreen();
        this.isMoving = true;
      }
    }
  }

  move(); {
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

  display(); {
    image(this.sprites, this.x, this.y, this.tileSize, this.tileSize);
  }

  debug(isON); {
    if (isON) {
      stroke(245);
      noFill();
      rect(this.x, this.y, this.tileSize, this.tileSize);
    }
  }


