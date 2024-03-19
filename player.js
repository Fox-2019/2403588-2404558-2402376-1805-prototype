class Player {
  constructor(sprites, startAcross, startDown, size, speed, tileRules) {
    this.sprites = sprites;
    this.currentSprite = this.sprites.right;
    this.across = startAcross;
    this.down = startDown;
    this.x = this.across * size;
    this.y = this.down * size;
    this.size = size;
    this.speed = speed;
    this.tileRules = tileRules;
    this.dirX = 0;
    this.dirY = 0;
    this.isMoving = false;
    this.tX = this.x;
    this.tY = this.y;
    this.health = 100;
  }

  setDirection() {
    if (!this.isMoving && !gameOver) {
      if (key === "w" || keyCode == UP_ARROW) {
        this.dirX = 0;
        this.dirY = -1;
        // this.currentSprite = this.sprites.up;
      }

      if (key === "s" || keyCode == DOWN_ARROW) {
        this.dirX = 0;
        this.dirY = 1;
        // this.currentSprite = this.sprites.down;
      }

      if (key === "a" || keyCode == LEFT_ARROW) {
        this.dirX = -1;
        this.dirY = 0;
        this.currentSprite = this.sprites.left;
      }

      if (key === "d" || keyCode == RIGHT_ARROW) {
        this.dirX = 1;
        this.dirY = 0;
        this.currentSprite = this.sprites.right;
      }

      this.checkTargetTile();
    }
  }

  checkTargetTile() {
    this.across = floor(this.x / this.size);
    this.down = floor(this.y / this.size);

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
        this.tX = nextTileHorizontal * this.size;
        this.tY = nextTileVertical * this.size;

        //camera move is ran before the player movement so by the time the player stops moving the camera will have moved aswell
        camera.moveIfOffscreen();
        this.isMoving = true;
      }
    }
  }

  move() {
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

  damage(amount) {
    this.health -= amount;

    if (this.health <= 0) {
      gameOver = true;
      this.health = 0;
    }
  }

  display() {
    push();
    image(this.currentSprite, this.x, this.y, this.size, this.size);
    fill(70, 220, 235);
    stroke(0, 50, 150);
    strokeWeight(2);
    rect(
      this.x,
      this.y + this.size,
      map(this.health, 0, 100, 0, this.size),
      10
    );
    pop();
  }

  debug(isON) {
    if (isON) {
      push();
      stroke(245);
      fill(255, 255, 255, 100);
      rect(this.x + 2, this.y + 2, this.size - 4, this.size - 4);
      pop();
    }
  }
}
