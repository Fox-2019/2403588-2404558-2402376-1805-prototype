class Camera {
  constructor() {
    this.IsMoving = false;
    this.Xtranslate = 0; //x and y translation used to move 'the camera'
    this.Ytranslate = 0;
    this.Xoffset = 25; //initial camera translate offset
    this.Yoffset = 25;
    this.DirX = 0;  //horizontal and vertical direction; X:-1 is left X:1 is right and so on
    this.DirY = 0;
    this.TargetX = 0;  //the target offset for the camera to achieve
    this.TargetY = 0;
    this.camSpeed = 20;
  }
  //use a function parameter to set the direction of the camera, passed in from moveIfOffscreen()
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
    //if the camera is set to "moving", use the speed and direction to translate it forward
    if (this.IsMoving) {
      this.Xtranslate += this.camSpeed * this.DirX;
      this.Ytranslate += this.camSpeed * this.DirY;
      
      //if the camera reaches the desired target, zero out direction and tell code that camera isnt moving
      if (
        this.Xtranslate === this.TargetX &&
        this.Ytranslate === this.TargetY
      ) {
        this.IsMoving = false;
        this.DirX = 0;
        this.DirY = 0;
        this.moveIfOffscreen();  //if the player moves to an adjacent chunk and before the camera finishes moving, moves to ANOTHER chunk the player wont be half-way offscreen
      }
    }
  }
  //if the player target is set to the tiles "offscreen" set the camera direction to the adjecent chunk
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
