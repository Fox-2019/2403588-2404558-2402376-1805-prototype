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
let debugFLIP = true; //true turns on all debug functions 
// Point system variables 
let points = 0; 
function preload() { 
  textures[0] = loadImage("leafy.png"); 
  textures[1] = loadImage("crystal.png"); 
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


  // Display points 

  textAlign(RIGHT); 

  textSize(20); 

  fill(255); 

  text("Points: " + points, width - 10, 30); 

} //END OF DRAW 

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

function keyPressed() { 

  camera.SetCamDir(); 

  player.setDirection(); 

} 
// Function to increase points 

function increasePoints(amount) { 

  points += amount; 

} 