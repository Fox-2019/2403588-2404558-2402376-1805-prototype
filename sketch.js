let debugFLIP = false; //true turns on all debug functions
let camera;
let fps = 60;

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

//COLLECTIBLES; jasveen, adam, ishma
let points = 0;
let emeraldsNum = 25; //numbers for each collectible
let potionsNum = 10;
let starsNum = 15;
let collectibles = [];
let collectibleSprites = [];

//DRAGON; jasveen, jess
let dragon;
let dragonImage;
let dragonSpeed = 0.5; // Initial speed of the dragon

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
  angleMode(DEGREES);
  frameRate(fps);

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

  //initial generation of each type of collectibles using a parameter
    for (let i = 0; i < emeraldsNum; i++) {
      spawnCollectible("E");
    }
    for (let i = 0; i < potionsNum; i++) {
      spawnCollectible("P");
    }
    for (let i = 0; i < starsNum; i++) {
      spawnCollectible("S");
    }
    // console.log(collectibles);

  //JASVEEN; code to create the dragon
  try {
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
      tileSize,
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
} // END OF SETUP

function draw() {
  background(50);
  push();

  DisplayGraphics();
  player.move();
  dragon.move(player); // Move the dragon towards the player
  camera.move();
}

function DisplayGraphics() {
  //ADAM; uses the translation variables to offset the world so it appears as if a virtual camera is being used, also runs any display function (for any graphics or UI)

  //translate every graphic ran below to appear as if a camera was following the player
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
    collectibles[i].debug(debugFLIP);
    collectibles[i].checkCollision(player);
  }

  player.display();
  player.debug(debugFLIP);

  dragon.display();
  dragon.debug(debugFLIP);

  displayPointsText();
}

function displayPointsText() {
  //shows top right box with "points" text
  push();
  textAlign(RIGHT);
  textSize(20);
  noStroke();
  fill(50, 50, 50, 200);
  //since this function is ran in displayGraphics both the box and the text need the camera tranlation; probably couldve pulled it out to not have to deal with the offsets
  rect(
    width - camera.Xtranslate + camera.Xoffset - 200,
    -camera.Ytranslate + camera.Yoffset - 15,
    width,
    30
  );
  stroke(50);
  strokeWeight(10);
  fill(255);
  text(
    "points:" + points,
    width - camera.Xtranslate + camera.Xoffset - 85,
    -camera.Ytranslate + camera.Yoffset + 5
  );
  pop();
}

function GenerateTextureMap() {
  //randomly generates the texture map which determines which tiles are walkable and which arent
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
  //uses the existing texture map to make the tile objects and set their parameters
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
  //any time a key is pressed, these two will run...
  camera.SetCamDir(); //this will set the direction for the camera
  player.setDirection(); //and this for the player
}

function spawnCollectible(type) {
  //ISH,JASVEEN,ADAM; funtion to be called any time we want a new item on the map
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

  //add new items to the array
  collectibles.push(new Collectible(type, across, down, tileSize));
}

function increaseEnemySpeed(itemType) {
  //depending on what type of item the player picks up, a different speed is applied
  switch (itemType) {
    case "E":
      dragon.speed += points / 5000; //least speed added
      break;
    case "P":
      dragon.speed += points / 2000; //medium speed but freeze effect
      dragon.dragonFreeze();
      break;
    case "S":
      dragon.speed += points / 1000; //most speed added
      break;
  }
}
