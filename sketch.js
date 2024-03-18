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
let points = 0
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
  // imageMode(CENTER);

  //generates the n x n map to determine where obstacle wall tiles are located
  GenerateTextureMap();

  //uses the generated texture map to create a 'tile map' and create the objects for each tile
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



} //END OF DRAW

//AB uses the translation variables to offset the world so it appears as if a virtual camera is being used, also runs the display class function for all tiles 
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

function generateCollectible() {
  let x, y, across, down;
  do {
    across = floor(random(0,mapSize));
    down = floor(random(0,mapSize));
  } while (textureMap[down][across] === 1);

  x = across * tileSize;
  y = down * tileSize;
  pickUpsArr.push(new Collectible(x, y));
}

/*
if you have value for across and down, you can access the tile by
tilemap[across][down].textureID -> this will get you 1 or 0
if (tilemap[across][down].textureID === 1)

*/

class Collectible {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = tileSize;
    this.collected = false;
    this.pickUpType;
    this.points;
  }

  //
  checkCollisions(player) {
    let d = dist(player.x, player.y, this.x * tileSize, this.y * tileSize);
    
    if(d < player.size + this.size) {
      this.pickUp();
      console.log(this.collected)
    }

    if(!this.collected && d < tileSize/2) {
      this.collected = true;
    }
  }

  display() {
    if (!this.collected) {
      image(collectibleSprite, this.x, this.y, this.size, this.size);
    }
  }

  pickUp() {
    this.collected = true;
  }
}