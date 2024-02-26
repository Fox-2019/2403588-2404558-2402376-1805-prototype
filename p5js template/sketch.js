
function setup() {
    createCanvas(1000, 1000);
    background(0, 200, 0);
  }
  

  

function draw(){
  stroke(0,10)
  fill(0,100,0);
  line( 0 ,mouseY, 1000, mouseY); 

}

function mousePressed() {
  circle(mouseX, mouseY, random(20,30));

  return false;
}