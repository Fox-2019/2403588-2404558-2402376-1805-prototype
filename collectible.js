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

  display() {
      image(this.sprite, this.x, this.y, this.size, this.size);
  }

  checkCollision(player) {
    if (
      !this.isCollected &&
      dist(player.x, player.y, this.x, this.y) < tileSize / 2
    ) {
      this.isCollected = true;

      increasePoints(this.points);

      //spawns a collectible of the same type
      spawnCollectible(this.type);
      // console.log(collectibles);
    }
  }
}
