//TILEMAPS
let tileSize = 50; //pixel size of tiles
let mapSize = 30; // n x n size of the tilemap
let tilemap = []; // contains each tile Object: outer array is Y inner arrays are Xs; tilemap[y][x]
let textures = [];
let textureMap = []; // same as tilemap but this determines which tile graphic is shown

//PLAYER
let player;
// let playerSprite = {};
let playerSprite;
let playerSpeed = 5;
let playerSize = tileSize;

let camera;

let debugFLIP = false; //true turns on all debug functions

//Point system variables

let points = 0

function preload() {
  textures[0] = loadImage("leafy.png");
  textures[1] = loadImage("crystal.png");

  playerSprite = loadImage("fairy.png");
  //for when we have original textures for the character
  // playerSprite = {
  //   up: loadImage("imgs/librarian-u.png"),
  //   down: loadImage("imgs/librarian-d.png"),
  //   left: loadImage("imgs/librarian-l.png"),
  //   right: loadImage("imgs/librarian-r.png"),
  // };
}

function setup() {
  createCanvas(550, 550);
  // imageMode(CENTER);

  //generates the n x n map to determine where obstacle wall tiles are located
  GenerateTextureMap();

  //uses the generated texture map to create a 'tile map' and create the objects for each tile
  GenerateTileMap();
  // console.log(tilemap);

  camera = new Camera();
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

  DisplayGraphics();
  player.move();
  camera.move();

textAlign(RIGHT);
textSize(20);
fill(255);
text("points:"+points,width-50,30);


} //END OF DRAW



function DisplayGraphics() {
  translate(
    camera.Xtranslate + camera.Xoffset,
    camera.Ytranslate + camera.Yoffset
  );

  for (let across = 0; across < mapSize; across++) {
    for (let down = 0; down < mapSize; down++) {
      tilemap[across][down].display();
      tilemap[across][down].debug(debugFLIP);
    }
  }

  player.display();
  player.debug(debugFLIP);
}

function GenerateTextureMap() {
  for (let y = 0; y < mapSize; y++) {
    textureMap[y] = [];

    for (let x = 0; x < mapSize; x++) {
      //whether tile is walkable or not is choosen randomly, 1 in 10 chance it'll be a stone
      let tileGen = floor(random(1, 11));
      if (tileGen > 1) tileGen = 0;

      textureMap[y][x] = tileGen;
    }
  }
}

function GenerateTileMap() {
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
}
//Not complete version need to link enemy code to the point system
//Function to increase points

function increasePoints(amount){
  points+=amount;
}

function keyPressed() {
  camera.SetCamDir();
  player.setDirection();
}

class Player {
  constructor(sprite, x, y, size, speed, textureMap) {
    this.sprite = sprite;
    this.x = x * size;
    this.y = y * size;
    this.size = size;
    this.speed = speed;
    this.textureMap = textureMap;
  }

  display() {
    image(this.sprite, this.x, this.y, this.size, this.size);
  }

  debug(show) {
    if (show) {
      noFill();
      stroke(255, 0, 0);
      rect(this.x, this.y, this.size, this.size);
    }
  }

  move() {
    // Calculate new position based on direction and speed
    let newX = this.x + this.speed * (keyIsDown(RIGHT_ARROW) - keyIsDown(LEFT_ARROW));
    let newY = this.y + this.speed * (keyIsDown(DOWN_ARROW) - keyIsDown(UP_ARROW));

    // Check for collision with crystals
    let playerBounds = {
      left: newX,
      right: newX + this.size,
      top: newY,
      bottom: newY + this.size
    };

    for (let down = 0; down < mapSize; down++) {
      for (let across = 0; across < mapSize; across++) {
        let tile = this.textureMap[down][across];
        if (tile.type === 1) { // Assuming type 1 represents crystals
          let tileBounds = {
            left: across * tileSize,
            right: (across + 1) * tileSize,
            top: down * tileSize,
            bottom: (down + 1) * tileSize
          };

          // Check for collision
          if (
            playerBounds.right > tileBounds.left &&
            playerBounds.left < tileBounds.right &&
            playerBounds.bottom > tileBounds.top &&
            playerBounds.top < tileBounds.bottom
          ) {
            // Collision detected, increase points, remove crystal, and respawn crystal
            increasePoints(1);
            this.textureMap[down][across] = new Tile(0, across, down, tileSize, 0); // Remove the crystal from the tilemap
            respawnCrystal();
          }
        }
      }
    }

    // Move the player only if no collision with walls occurred
    if (newX >= 0 && newX < width - this.size && newY >= 0 && newY < height - this.size) {
      this.x = newX;
      this.y = newY;
    }
  }

  respawnCrystal() {
    let x, y;
    do {
      x = floor(random(mapSize));
      y = floor(random(mapSize));
    } while (this.textureMap[y][x].type !== 0); // Keep selecting random position until an empty tile is found

    this.textureMap[y][x] = new Tile(1, x, y, tileSize, 0); // Respawn the crystal at the new position
  }
}
