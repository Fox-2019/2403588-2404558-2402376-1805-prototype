//TILEMAPS
let tileSize = 50; //pixel size of tiles
let mapSize = 10; // n x n size of the tilemap
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

let debugFLIP = false; //true turns on all debug functions

//COLLECTIBLES; jasveen, adam, ishma
let points = 0;
let pointValues = {
  E: 2, // emeralds
  P: 5, // potions
  S: 10 // stars
}

//numbers for each collectible
let emeraldsNum = 10;
let potionsNum = 5;
let starsNum = 2;
let emeralds = [];
let emeraldImage;


function preload() {
  textures[0] = loadImage("JESS ASSETS/leafy.png");
  textures[1] = loadImage("JESS ASSETS/crystal.png");

  playerSprite = {
    left: loadImage("JESS ASSETS/fairy side view.png"),
    right: loadImage("JESS ASSETS/fairy.png"),
  };

  emeraldImage = loadImage("JESS ASSETS/emerald.png");

}

function setup() {
  createCanvas(550, 550);
  GenerateTextureMap();
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

  for(let i=0 ; i<emeraldsNum; i++) {
    spawnEmerald();
  }
  // console.log(emeralds);
  
} // END OF SETUP

function draw() {
  background(50);
  push();
  
  DisplayGraphics();
  player.move();
  camera.move();
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
  // Display and check collision for each emerald
  for (let i = 0; i < emeralds.length; i++) {
    emeralds[i].display();
    emeralds[i].checkCollision(player);
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
  let across, down;
  do {
    across = floor(random(0, mapSize));
    down = floor(random(0, mapSize));
  } while (textureMap[down][across] === 1); // Check if the position overlaps with a crystal tile

  emeralds.push(new Emerald(emeraldImage, across, down, tileSize, "E"));
}

//EMERALD CLASS
class Emerald {
  constructor(image, across, down, size, type) {
    this.image = image;
    this.across = across;
    this.down = down;
    this.size = size;
    this.x = this.across * this.size;
    this.y = this.down * this.size;
    this.type = type
    this.pointValues = pointValues
    this.points;
    this.isCollected = false;
  }

  checkPointValues() {
    if(this.type = this.pointValues.E) {
      this.points = 2;
    } else if (this.type = this.pointValues.P) {
      this.points = 5;
    } else if (this.type = this.pointValues.S) {
      this.points = 10;
    }
  }

  display() {
    if (!this.isCollected) {
      image(this.image, this.x, this.y, this.size, this.size);
    }
  }

  checkCollision(player) {
    if (!this.isCollected && dist(player.x, player.y, this.x, this.y ) < tileSize / 2) {
      this.isCollected = true;
      
      this.checkPointValues();
      
      increasePoints(this.points);
      
      spawnEmerald();
      // console.log(emeralds);
    }
  }

}


