let debugFLIP = false; //true turns on all debug functions
let camera;

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

//COLLECTIBLES; jasveen, adam, ishma
let points = 0;
let emeraldsNum = 10; //numbers for each collectible
let potionsNum = 5;
let starsNum = 2;
let collectibles = [];
let collectibleSprites = [];

//DRAGON
let dragon;
let dragonImage;
let dragonSpeed = 1; // Initial speed of the dragon

function preload() {
  textures[0] = loadImage("JESS ASSETS/leafy.png");
  textures[1] = loadImage("JESS ASSETS/crystal.png");

  playerSprite = {
    left: loadImage("JESS ASSETS/fairy side view.png"),
    right: loadImage("JESS ASSETS/fairy.png"),
  };

  collectibleSprites[0] = loadImage("JESS ASSETS/emerald.png");
  collectibleSprites[1] = loadImage("JESS ASSETS/potion.png");
  collectibleSprites[2] = loadImage("JESS ASSETS/star.png");

  dragonImage = loadImage("JESS ASSETS/dragon.png");
}

function setup() {
  createCanvas(550, 550);
  try {
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

    //generate each type of collectibles using a parameter
    for (let i = 0; i < emeraldsNum; i++) {
      spawnCollectible("E");
    }
    for (let i = 0; i < potionsNum; i++) {
      spawnCollectible("P");
    }
    for (let i = 0; i < starsNum; i++) {
      spawnCollectible("S");
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
  // console.log(collectibles);
} // END OF SETUP

function draw() {
  background(50);
  push();

  DisplayGraphics();
  player.move();
  dragon.move(player); // Move the dragon towards the player
  camera.move();
}
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
  // Display and check collision for each collectible
  for (let i = 0; i < collectibles.length; i++) {
    collectibles[i].display();
    collectibles[i].checkCollision(player);
  }

  player.display();
  player.debug(debugFLIP);
  dragon.display(); // Display the dragon
  displayPointsText();
}

function displayPointsText() {
  textAlign(RIGHT);
  textSize(20);
  noStroke();
  fill(50, 50, 50, 200);
  rect(
    width - camera.Xtranslate + camera.Xoffset - 190,
    -camera.Ytranslate + camera.Yoffset - 25,
    width,
    40
  );
  stroke(50);
  strokeWeight(10);
  fill(255);
  text(
    "points:" + points,
    width - camera.Xtranslate + camera.Xoffset - 85,
    -camera.Ytranslate + camera.Yoffset + 1
  );
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

function spawnCollectible(type) {
  let across, down, collectibleExists;

  do {
    //this code will keep running until it finds the correct coordinates
    across = floor(random(0, mapSize));
    down = floor(random(0, mapSize));

    //we filter through all collectibles to find any that are on the same coordinates as the ones generated
    const filtered = collectibles.filter(
      (c) => c.across == across && c.down == down
    );

    //if there is a collectible in those coordinates, that array will have one index
    collectibleExists = filtered.length > 0;

    // Check if the position overlaps with a crystal tile and if there is a collectible in the generated coordinates
  } while (textureMap[down][across] === 1 || collectibleExists);

  collectibles.push(new Collectible(type, across, down, tileSize));
}

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
