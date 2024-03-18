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
    if (!this.isCollected && dist(player.x, player.y, this.x, this.y) < tileSize / 2) {
      this.isCollected = true;
      increasePoints(2);
    }
  }
}

// Declare Emerald object and load its image
let emerald;
let emeraldImage;

//TILEMAPS
let tileSize = 50; //pixel size of tiles
let mapSize = 30; // n x n size of the tilemap
let tilemap = []; // contains each tile Object: outer array is Y inner arrays are Xs; tilemap[y][x]
let textures = [];
let textureMap = []; // same as tilemap but this determines which tile graphic is shown

//PLAYER
let player;
let playerSprite;
let playerSpeed = 5;
let playerSize = tileSize;

let camera;

let debugFLIP = false; //true turns on all debug functions

//Point system variables
let points = 0;

function preload() {
  textures[0] = loadImage("leafy.png");
  textures[1] = loadImage("crystal.png");
  playerSprite = loadImage("fairy.png");
  emeraldImage = loadImage("emerald.png"); // Load emerald image
}

function setup() {
  createCanvas(550, 550);
  GenerateTextureMap();
  GenerateTileMap();
  camera = new Camera();
  player = new Player(playerSprite, floor(random(0, 10)), floor(random(0, 10)), playerSize, playerSpeed, textureMap);
  emerald = new Emerald(emeraldImage, floor(random(0, mapSize)), floor(random(0, mapSize)), tileSize); // Initialize Emerald object
}

function draw() {
  background(50);
  DisplayGraphics();
  player.move();
  camera.move();
  textAlign(RIGHT);
  textSize(20);
  fill(255);
  text("points:" + points, width - 50, 30);
  emerald.display();
  emerald.checkCollision(player);
}

function DisplayGraphics() {
  translate(camera.Xtranslate + camera.Xoffset, camera.Ytranslate + camera.Yoffset);
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

