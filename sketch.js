// Load dragon image
let dragonImage;

// Declare Dragon object
let dragon;

// Initialize dragon speed
let dragonSpeed = 2;

function preload() {
  textures[0] = loadImage("leafy.png");
  textures[1] = loadImage("crystal.png");
  playerSprite = loadImage("fairy.png");
  emeraldImage = loadImage("emerald.png");
  dragonImage = loadImage("dragon.png"); // Load dragon image
}

function setup() {
  createCanvas(550, 550);
  GenerateTextureMap();
  GenerateTileMap();
  camera = new Camera();
  player = new Player(playerSprite, floor(random(0, 10)), floor(random(0, 10)), playerSize, playerSpeed, textureMap);

  // Initialize Dragon object
  dragon = new Dragon(dragonImage, floor(random(0, 10)), floor(random(0, 10)), playerSize, dragonSpeed, textureMap);

  // Initialize emeralds
  for (let i = 0; i < 2; i++) {
    spawnEmerald();
  }
}

function draw() {
  background(50);
  DisplayGraphics();
  player.move();
  dragon.move(); // Move the dragon
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

  // Check collision between player and dragon
  if (dist(player.x, player.y, dragon.x, dragon.y) < tileSize / 2) {
    gameOver();
  }
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

  move() {
    // Calculate direction towards the player
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let angle = atan2(dy, dx);
    // Move towards the player
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  display() {
    image(this.image, this.x, this.y, this.size, this.size);
  }
}

function increasePoints(amount) {
  points += amount;
  // Increase dragon speed every 10 points
  if (points % 10 === 0) {
    dragon.speed += 0.5;
  }
}

function gameOver() {
  textSize(32);
  textAlign(CENTER);
  fill(255, 0, 0);
  text("Game Over", width / 2, height / 2);
  noLoop(); // Stop the game loop
}




