let debugFLIP = false; //true turns on all debug functions
let camera;
let fps = 60;

//BLACKSCREEN/GAMEOVER
let cnv;
let animCircleSize = 0;
let gameStart = true;
let gameOver = false;

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
let playerSpeed = 25;
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
let dragonImage = [];
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

  dragonImage = {
    dragon: loadImage("JESS ASSETS/dragon.png"),
    pinky: loadImage("JESS ASSETS/pinky.png"),
  };
}

function setup() {
  createCanvas(550, 550);
  cnv = createGraphics(width * 6, height * 6);
  angleMode(DEGREES);
  frameRate(fps);

  GenerateTextureMap();
  GenerateTileMap();
  // console.log(tilemap);

  //randomly assign a walkable tile for the player to spawn on
  let randX, randY;
  do {
    randX = floor(random(0, mapSize));
    randY = floor(random(0, mapSize));
  } while (textureMap[randY][randX] === 1);

  player = new Player(
    playerSprite,
    randX,
    randY,
    playerSize,
    playerSpeed,
    textureMap
  );

  //initialize the camera and move it if the player isnt on-screen
  camera = new Camera();
  camera.moveIfOffscreen();

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

  DisplayGraphics();
  player.move();
  dragon.move(player); // Move the dragon towards the player
  camera.move();

  gameStateAnim();
} // END OF DRAW

function gameStateAnim() {
  push();
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER);
  textAlign(CENTER);
  cnv.background(0);
  cnv.fill(0);

  if (gameStart) {
    cnv.erase();

    animCircleSize += 0.4;
    if (animCircleSize > 20) {
      animCircleSize += 1;
    }
    if (animCircleSize > 50) {
      animCircleSize += 1;
    }
    if (animCircleSize > 100) {
      animCircleSize += animCircleSize - 100;
    }
    if (animCircleSize > 4000) {
      animCircleSize = 2000;
      gameStart = false;
      // gameOver = true;
    }
  }
  //we create a circle on the second canvas and increase its size with "time", using it with the erase() function creates a hole in the canvas through which we can see the initial canvas ie: the game
  cnv.circle(cnv.width / 2, cnv.height / 2, animCircleSize);

  if (gameOver) {
    animCircleSize -= 20;

    if (animCircleSize < 0) {
      //when the animation is finished, we make sure the circle cannot grow uncontrollably as well as turning off the erase function
      cnv.noErase();
      animCircleSize = 0;
      cnv.background(0);
      gameOver = false;
    }
  }

  // console.log(animCircleSize);

  //any additional canvas has to be applied to the initial canvas with a image funtion
  image(cnv, player.x + camera.Xoffset, player.y + camera.Yoffset);

  //if the player has lost and the circle animation has finished, create the game over text and allow for easy restart
  if (!gameOver && animCircleSize == 0) {
    fill(255);
    textSize(50);
    text(
      "GAME OVER",
      width / 2 - 20 - camera.Xtranslate,
      height / 2 - 10 - camera.Ytranslate
    );
    textSize(20);
    text(
      "Score: " + points,
      width / 2 - 20 - camera.Xtranslate,
      height / 2 + 15 - camera.Ytranslate
    );
    textSize(15);
    text(
      "Press R to reload",
      width / 2 - 20 - camera.Xtranslate,
      height - 50 - camera.Ytranslate
    );
    if (keyIsDown(82)) location.reload();
  }
  pop();
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

  enemyIndicator();
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
      dragon.speed += points / 6000; //least speed added
      break;
    case "P":
      dragon.speed += points / 4000; //medium speed but freeze effect
      dragon.dragonFreeze();
      break;
    case "S":
      dragon.speed += points / 2000; //most speed added
      break;
  }
}

function enemyIndicator() {
  //ADAM this function will calculate and show a diamond indicator on the screen to show where the enemy is in relation to the player
  let x, y;

  //calculate the pixel difference between the dragon and the center of the screen (has to include the current camera offset from origin)
  let dx = width / 2 - camera.Xtranslate - camera.Xoffset - dragon.x;
  let dy = height / 2 - camera.Ytranslate - camera.Yoffset - dragon.y;

  //if that distance is less than half of screen size, dont display the indicator
  if (abs(dx) < width / 2 && abs(dy) < height / 2) return;

  //calculate the angle between center of screen and dragon (up is -90, down is 90)
  let angle = atan2(dy, dx);

  //check which "quadrant" the dragon is in (in relation to center of screen), and map the coordinates of the indicator to only appear near the edges of the screen
  if (angle >= -45 && angle <= 45) {
    //left screen edge
    x = 10;
    y = map(angle, -45, 45, height - 10, 10);
  } else if (angle <= -135 && angle >= -180) {
    //bottom-half right screen edge
    x = width - 10;
    y = map(angle, -135, -180, height - 10, height / 2);
  } else if (angle >= 135 && angle <= 180) {
    //top-half right screen edge
    x = width - 10;
    y = map(angle, 135, 180, 10, height / 2);
  } else if (angle > -135 && angle < -45) {
    //bottom screen edge
    x = map(angle, -135, -45, width - 10, 10);
    y = height - 10;
  } else if (angle < 135 && angle > 45) {
    //top screen edge
    x = map(angle, 135, 45, width - 10, 10);
    y = 10;
  }

  //since this function is called within displayGraphics (which uses the translate function), we need to remove the camera translation to achieve screen space; there could've been a way to not use this but the alternative seemed confusing in it's own right
  x = x - camera.Xtranslate - camera.Xoffset;
  y = y - camera.Ytranslate - camera.Yoffset;
  // console.log(angle);
  // console.log(x, y);

  //set the graphic of the indicator
  push();
  rectMode(CENTER);
  translate(x, y); //without this translate the indicator wont move with the camera
  rotate(45); //rotation to achieve diamond shape
  stroke(180, 0, 180); //light purple
  strokeWeight(3);
  fill(100, 0, 100); //darker purple
  rect(0, 0, 30, 30);
  fill(0);
  circle(0, 0, 10);

  //if dragon is frozen, reflect that in the indicator
  let alpha = map(dragon.freezeMultiplier, 0, 1, 240, 0);
  stroke(80, 80, 250, alpha);
  fill(120, 120, 250, alpha);
  rect(0, 0, 30, 30);

  pop();
}
