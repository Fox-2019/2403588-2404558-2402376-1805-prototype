//COLLECTIBLES CLASS
class Collectible {
  constructor(type, across, down, size) {
    this.sprite;
    this.across = across;
    this.down = down;
    this.size = size;
    this.x = this.across * this.size;
    this.y = this.down * this.size;
    this.type = type;
    this.points;
    this.checkType(); //this function run each time the object is constructed
    // console.log(`Collectible ${this.type} created`);
  }

  //check the item type to determine which sprite to display and how many points to award
  checkType() {
    if (this.type == "E") {
      this.points = 2;
      this.sprite = collectibleSprites[0];
    } else if (this.type == "P") {
      this.points = 5;
      this.sprite = collectibleSprites[1];
    } else if (this.type == "S") {
      this.points = 10;
      this.sprite = collectibleSprites[2];
    }
  }

  checkCollision(player) {
    //if the distance between the item and player is small enough...
    if (dist(player.x, player.y, this.x, this.y) < tileSize / 2) {
      //...filter the item array and return only the ones that arent the current one (ie remove current)
      collectibles = collectibles.filter((c) => c != this);

      increasePoints(this.points);

      //spawns a collectible of the same type
      spawnCollectible(this.type);
      increaseEnemySpeed(this.type);
      // console.log(collectibles);
    }
  }

  display() {
    image(this.sprite, this.x, this.y, this.size, this.size);
  }

  debug(isON) {
    if (isON) {
      switch (this.type) {
        case "E":
          stroke(0, 240, 0);
          break;
        case "P":
          stroke(0, 0, 240);
          break;
        case "S":
          stroke(240, 240, 0);
          break;
      }
      noFill();
      rect(this.x + 2, this.y + 2, this.size - 4, this.size - 4);
    }
  }
}
