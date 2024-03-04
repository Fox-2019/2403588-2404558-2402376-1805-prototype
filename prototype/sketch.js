//TILEMAPS
let tileSize = 50;
let mapSize = 10; // n x n size of the tilemap
let tilemap = []; // outer array is Y inner arrays are Xs; tilemap[y][x]
// let initX = 50; // initial X coordinate
// let initY = 50; // initial Y coordinate

let textures = [];
let textureMap = [
  // [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  // [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  // [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//PLAYER
let player;
// let playerSprite = {};
let playerSprite;
let playerSpeed = 5;
let playerSize = tileSize;

function preload() {
  textures[0] = loadImage("leafy.png");
  textures[1] = loadImage("crystal.png");

  playerSprite = loadImage("fairy.png")
  //for when we have original textures for the character
  // playerSprite = {
  //   up: loadImage("imgs/librarian-u.png"),
  //   down: loadImage("imgs/librarian-d.png"),
  //   left: loadImage("imgs/librarian-l.png"),
  //   right: loadImage("imgs/librarian-r.png"),
  // };
}

function setup() {
  createCanvas(500, 500);
  // imageMode(CENTER);

  //generate textureMap
  for(let y=0; y<mapSize; y++) {
    textureMap[y] = [];

    for(let x=0; x<mapSize; x++) {
      //whether tile is walkable or not is choosen randomly, 1 in 10 is a stone
      let tileGen = floor(random(1,11));
      if(tileGen > 1) tileGen = 0;

      textureMap[y][x] = tileGen;
    }
  }



  let id = 0;

  // X loop
  for (let across = 0; across < mapSize; across++) {
    tilemap[across] = [];
    // Y loop
    for (let down = 0; down < mapSize; down++) {
      tilemap[across][down] = new Tile(
        textureMap[down][across],
        across,
        down,
        tileSize,
        id
      );

      id++;
    }
  }
  // console.log(tilemap);

  player = new Player(
    playerSprite,
    floor(random(0, 10)),
    floor(random(0, 10)),
    playerSize,
    playerSpeed,
    textureMap
  );
} // END OF SETUP

function draw() {
  background(50);
  // tile1.display();
  // tile1.debug();
  for (let across = 0; across < mapSize; across++) {
    for (let down = 0; down < mapSize; down++) {
      tilemap[across][down].display();
      // tilemap[across][down].debug();
    }
  }

  player.display();
  player.move();
  player.debug();
} //END OF DRAW

function keyPressed() {
  player.setDirection();
}

class Tile {
  constructor(textureID, across, down, size, ID) {
    this.textureID = textureID;
    this.tileID = ID;
    this.sprite;
    this.across = across;
    this.down = down;
    this.x = across * size;
    this.y = down * size;
    this.tileSize = size;
  }

  display() {
    this.sprite = textures[this.textureID];
    image(this.sprite, this.x, this.y, this.tileSize, this.tileSize);
  }

  debug() {
    //TILE
    stroke(150, 0, 0);
    fill(55, 55, 55, 150);
    rect(this.x, this.y, this.tileSize, this.tileSize);

    //this takes the 'id' of the object and if its a single digit: manually adds a 0 to the front
    let tempID;
    if (this.tileID < 10) {
      tempID = "0" + this.tileID;
    } else {
      tempID = this.tileID;
    }

    //LABEL
    noStroke();
    fill(245);
    textAlign(LEFT, TOP);
    text(tempID, this.x + 2, this.y + 2);
  }
} //END OF TILE

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

  setDirection() {
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

  checkTargetTile() {
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

  display() {
    image(this.sprites, this.x, this.y, this.tileSize, this.tileSize);
  }

  debug() {
    //TILE
    stroke(245);
    noFill();
    rect(this.xPos, this.yPos, this.tileSize, this.tileSize);

    //LABEL
    noStroke();
    fill(255);
    textAlign(LEFT, TOP);

    text(this.tileID, this.xPos, this.yPos);
  }
}
