class Camera {
  constructor() {
    this.IsMoving = false;
    this.Xtranslate = 0; //x and y translation used to move 'the camera'
    this.Ytranslate = 0;
    this.Xoffset = 25; //initial camera translate offset
    this.Yoffset = 25;
    this.DirX = 0;
    this.DirY = 0;
    this.TargetX = 0;
    this.TargetY = 0;
    this.camSpeed = 20;
  }
  SetCamDir(direction) {
    if (!this.IsMoving) {
      if (direction === "Down") {
        this.DirX = 0;
        this.DirY = -1;
        this.IsMoving = true;
      }

      if (direction === "Up") {
        this.DirX = 0;
        this.DirY = 1;
        this.IsMoving = true;
      }

      if (direction === "Right") {
        this.DirX = -1;
        this.DirY = 0;
        this.IsMoving = true;
      }

      if (direction === "Left") {
        this.DirX = 1;
        this.DirY = 0;
        this.IsMoving = true;
      }

      this.TargetX = this.Xtranslate + this.DirX * 10 * tileSize;
      this.TargetY = this.Ytranslate + this.DirY * 10 * tileSize;
    }
  }
  move() {
    // console.log(key);
    if (this.IsMoving) {
      this.Xtranslate += this.camSpeed * this.DirX;
      this.Ytranslate += this.camSpeed * this.DirY;

      if (
        this.Xtranslate === this.TargetX &&
        this.Ytranslate === this.TargetY
      ) {
        this.IsMoving = false;
        this.DirX = 0;
        this.DirY = 0;
        this.moveIfOffscreen();
      }
    }
  }
  moveIfOffscreen() {
    if (player.tX >= width - tileSize - this.Xtranslate) {
      this.SetCamDir("Right");
    }
    if (player.tX <= abs(this.Xtranslate) - tileSize) {
      this.SetCamDir("Left");
    }
    if (player.tY >= height - tileSize - this.Ytranslate) {
      this.SetCamDir("Down");
    }
    if (player.tY <= abs(this.Ytranslate) - tileSize) {
      this.SetCamDir("Up");
    }
  }
}
