class Tile {
  constructor(textureID, across, down, size, ID) {
    this.textureID = textureID;
    this.tileID = ID;
    this.sprite;
    this.across = across;
    this.down = down;
    this.x = across * size;
    this.y = down * size;
    this.tileSize = size;
  }

  display() {
    this.sprite = textures[this.textureID];
    image(this.sprite, this.x, this.y, this.tileSize, this.tileSize);
  }

  debug(isON) {
    if (isON) {
      //red outline
      stroke(150, 0, 0);
      fill(55, 55, 55, 150);
      rect(this.x, this.y, this.tileSize, this.tileSize);

      let tempID;
      tempID = this.across + ";" + this.down;

      //tile xy position text
      noStroke();
      fill(245);
      textAlign(LEFT, TOP);
      text(tempID, this.x + 2, this.y + 2);
      // text(this.across, this.x + 10, this.y + 2);
      // text(this.down, this.x + this.tileSize - 20, this.y + 2);
    }
  }
}
