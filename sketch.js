//EMERALD CLASS
class Emerald {
  constructor(image, x, y, size) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.size = size;
    this.isCollected = false;
  }

  display() {
    if (!this.isCollected) {
      image(this.image, this.x * tileSize, this.y * tileSize, this.size, this.size);
    }
  }

  checkCollision(player) {
    if (!this.isCollected && dist(player.x, player.y, this.x * tileSize, this.y * tileSize) < tileSize / 2) {
      this.isCollected = true;
      increasePoints(2);
      respawnEmeralds();
    }
  }
}

// Declare Emerald objects array and load its image
let emeralds = [];
let emeraldImage;

//TILEMAPS
let tileSize = 50; //pixel size of tiles
let mapSize = 30; // n x n size of the tilemap
let tilemap = []; // contains each tile Object: outer array is Y inner arrays are Xs; tilemap[y][x]
let textures = [];
let textureMap = []; // same as tilemap but this determines which tile graphic is shown

//PLAYER
let player;
let playerSprite = {};
// let playerSprite;
let playerSpeed = 10;
let playerSize = tileSize;

let camera;

let debugFLIP = true; //true turns on all debug functions

//ishma & jasveen with adams help
//Collectibles system variables
let points = 0;
let pickUpsArr = []; //array of collectibles
let collectNum = 100; //number of collectibles at any time
let collectibeSprite;


function preload() {
  textures[0] = loadImage("JESS ASSETS/leafy.png");
  textures[1] = loadImage("JESS ASSETS/crystal.png");

  //for when we have original textures for the character
  playerSprite = {
    left: loadImage("JESS ASSETS/fairy side view.png"),
    right: loadImage("JESS ASSETS/fairy.png"),
  };

    // playerSprite = loadImage("JESS ASSETS/fairy.png");
    collectibleSprite = loadImage("JESS ASSETS/emerald.png");

}

function setup() {
  createCanvas(550, 550);
  GenerateTextureMap();
  GenerateTileMap();
  // console.log(tilemap);

  //ISHMA & JASVEEN create collectibles
  for(let i=0; i<collectNum; i++) {
    generateCollectible();
  }
  // console.log(pickUpsArr);
  // console.log(textureMap)


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
  push();
  
  DisplayGraphics();
  player.move();
  camera.move();
  textAlign(RIGHT);
  textSize(20);
  fill(255);
  text("points:" + points, width - 50, 30);

  // Display and check collision for each emerald
  for (let i = 0; i < emeralds.length; i++) {
    emeralds[i].display();
    emeralds[i].checkCollision(player);
  }
}

function DisplayGraphics() {

  //translate every graphic to appear as if a camera was following the player
  translate(
    camera.Xtranslate + camera.Xoffset,
    camera.Ytranslate + camera.Yoffset
  );

    //display the tiles
  for (let across = 0; across < mapSize; across++) {
    for (let down = 0; down < mapSize; down++) {
      tilemap[across][down].display();
      tilemap[across][down].debug(debugFLIP);
    }
  }

  //display the pickups
  for (let i=0; i<collectNum; i++) {
    pickUpsArr[i].display();
    pickUpsArr[i].checkCollisions(player);
  }
  player.display();
  player.debug(debugFLIP);
  displayPointsText();

}

function displayPointsText() {
  textAlign(RIGHT);
  textSize(20);
  stroke(0);
  strokeWeight(10);
  fill(255);
  text("points:" + points, width-camera.Xtranslate+camera.Xoffset-80, -camera.Ytranslate+camera.Yoffset);
  pop();
}

function GenerateTextureMap() {
  for (let y = 0; y < mapSize; y++) {
    textureMap[y] = [];
    for (let x = 0; x < mapSize; x++) {
      let tileGen = floor(random(1, 11));
      if (tileGen > 1) tileGen = 0;
      textureMap[y][x] = tileGen;
    }
  }
}

function GenerateTileMap() {
  let id = 0;
  for (let across = 0; across < mapSize; across++) {
    tilemap[across] = [];
    for (let down = 0; down < mapSize; down++) {
      tilemap[across][down] = new Tile(textureMap[down][across], across, down, tileSize, id);
      id++;
    }
  }
}

function increasePoints(amount) {
  points += amount;
}

function keyPressed() {
  camera.SetCamDir();
  player.setDirection();
}

function spawnEmerald() {
  let x, y;
  do {
    x = floor(random(0, mapSize));
    y = floor(random(0, mapSize));
  } while (textureMap[y][x] === 1); // Check if the position overlaps with a crystal tile

  emeralds.push(new Emerald(emeraldImage, x, y, tileSize));
}

function respawnEmeralds() {
  emeralds = []; // Clear existing emeralds
  for (let i = 0; i < 2; i++) { // Respawn 2 emeralds
    spawnEmerald();
  }
}


