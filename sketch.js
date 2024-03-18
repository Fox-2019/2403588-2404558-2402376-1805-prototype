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
      image(
        this.image,
        this.x * tileSize,
        this.y * tileSize,
        this.size,
        this.size
      );
    }
  }

  checkCollision(player) {
    if (
      !this.isCollected &&
      dist(player.x, player.y, this.x * tileSize, this.y * tileSize) <
        tileSize / 2
    ) {
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
let playerSprite;
let playerSpeed = 5;
let playerSize = tileSize;

//DRAGON
let dragon;
let dragonImage;
let dragonSpeed = 2; // Initial speed of the dragon

let camera;

let debugFLIP = false; //true turns on all debug functions

//Point system variables
let points = 0;

function preload() {
  textures[0] = loadImage("leafy.png");
  textures[1] = loadImage("crystal.png");
  playerSprite = loadImage("fairy.png");
  emeraldImage = loadImage("emerald.png"); // Load emerald image
  dragonImage = loadImage("dragon .png"); // Load dragon image
}

function setup() {
  createCanvas(550, 550);
  try {
    GenerateTextureMap();
    GenerateTileMap();
    camera = new Camera();
    player = new Player(
      playerSprite,
      floor(random(0, 10)),
      floor(random(0, 10)),
      playerSize,
      playerSpeed,
      textureMap
    );

    // Initialize Emerald objects array with random positions
    for (let i = 0; i < 4; i++) {
      // Initially spawn 4 emeralds
      spawnEmerald();
    }

    // Initialize the dragon
    let dragonX, dragonY;
    do {
      dragonX = floor(random(0, mapSize));
      dragonY = floor(random(0, mapSize));
    } while (textureMap[dragonY][dragonX] === 1); // Ensure dragon doesn't spawn on crystal tile
    dragon = new Dragon(
      dragonImage,
      dragonX,
      dragonY,
      playerSize,
      dragonSpeed,
      textureMap
    );
  } catch (error) {
    console.error(error);
    textSize(24);
    fill(255);
    text(
      "Error occurred during setup. Check console for details.",
      width / 2,
      height / 2
    );
    noLoop(); // Stop the game loop
  }
}

function draw() {
  background(50);
  DisplayGraphics();
  player.move();
  dragon.move(player); // Move the dragon towards the player
  camera.move();

  textAlign(RIGHT);
  textSize(20);
  fill(255);
  text("points:" + points, width - 50, 30);
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
  dragon.display(); // Display the dragon
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

// Dragon class
class Dragon {
  constructor(image, x, y, size, speed, textureMap) {
    this.image = image;
    this.x = x * tileSize;
    this.y = y * tileSize;
    this.size = size;
    this.speed = speed;
    this.textureMap = textureMap;
  }

  move(player) {
    let targetX = player.x;
    let targetY = player.y;

    // Calculate direction towards the player
    let dx = targetX - this.x;
    let dy = targetY - this.y;

    // Move towards the player
    if (dx !== 0 || dy !== 0) {
      let angle = atan2(dy, dx);
      let newX = this.x + cos(angle) * this.speed;
      let newY = this.y + sin(angle) * this.speed;

      // Check if the next position is a crystal tile
      let nextTileX = floor(newX / tileSize);
      let nextTileY = floor(newY / tileSize);
      if (this.textureMap[nextTileY][nextTileX] === 1) {
        // If the next position is a crystal tile, try to find an alternative path
        let alternatives = [
          { x: nextTileX + 1, y: nextTileY }, // Right
          { x: nextTileX - 1, y: nextTileY }, // Left
          { x: nextTileX, y: nextTileY + 1 }, // Down
          { x: nextTileX, y: nextTileY - 1 }, // Up
        ];

        for (let alt of alternatives) {
          if (this.textureMap[alt.y][alt.x] !== 1) {
            newX = alt.x * tileSize;
            newY = alt.y * tileSize;
            break;
          }
        }
      }

      this.x = newX;
      this.y = newY;
    }
  }

  display() {
    image(this.image, this.x, this.y, this.size, this.size);
  }
}
