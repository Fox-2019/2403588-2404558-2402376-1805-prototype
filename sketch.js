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
  collectibeSprite = loadImage("coin.jpg");
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

for (let collectible of collectibles) {
  collectible.display();
  if (player.intersects(collectible)) {
    collectible.pickup(); // Remove collectible if player intersects with it
  }
}


} //END OF DRAW


//AB uses the translation variables to offset the world so it appears as if a virtual camera is being used, also runs the display class function for all tiles 
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


function generateCollectibles(num) {
  for (let i = 0; i < num; i++) {
    let x = random(width);
    let y = random(height);
    collectibles.push(new Collectible(x, y));
  }
}

//Collectibles

class Collectible {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 1;
  }

  display() {
    if (!this.collected) {
      image(collectibleSprite, this.x, this.y, this.size, this.size);
    }
  }

  pickup() {
    this.collected = true; 
    // Increase score or perform other actions
  }
}

