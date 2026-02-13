let stemHeight = 0;
let maxStemHeight = 350;
let bloomScale = 0;
let numSeeds = 0;
let maxSeeds = 200;

let clouds = [];
let beePos;
let isBeeLanding = false;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  beePos = createVector(-50, 100);
  
  // Initialize drifting clouds
  for (let i = 0; i < 4; i++) {
    clouds.push({ x: random(width), y: random(50, 150), speed: random(0.2, 0.5) });
  }
}

function draw() {
  drawSky();
  
  // Draw Clouds
  for (let c of clouds) {
    drawCloud(c.x, c.y);
    c.x += c.speed;
    if (c.x > width + 50) c.x = -100;
  }

  drawSun();

  // Soil & Grass
  noStroke();
  fill(139, 94, 60); // Brown soil
  rect(0, height - 60, width, 60);
  fill(0, 0, 0, 50); // Soil texture dots
  for(let i=0; i<width; i+=20) ellipse(i + (frameCount%20), height-30, 5, 5);

  // Growth Logic
  if (stemHeight < maxStemHeight) stemHeight += 2;
  
  let bend = map(mouseX, 0, width, -50, 50);
  let fx = width/2 + bend;
  let fy = height - 60 - stemHeight;

  drawStem(width/2, height-60, fx, fy, bend);

  if (stemHeight >= maxStemHeight) {
    if (bloomScale < 1.0) bloomScale += 0.01;
    
    push();
    translate(fx, fy);
    let headTilt = constrain(map(mouseX, 0, width, -30, 30), -30, 30);
    rotate(headTilt);
    
    // 1. Draw Petals (Solid Yellow)
    drawPetals(bloomScale);
    
    // 2. Draw Seed Center (Dark Brown)
    drawSeeds(bloomScale);
    pop();

    updateBee(fx, fy);
  }
}

function drawSky() {
  background(135, 206, 235); // Classic blue sky
}

function drawSun() {
  fill(255, 230, 0);
  noStroke();
  ellipse(mouseX, mouseY, 60, 60);
  fill(255, 255, 255, 100);
  ellipse(mouseX, mouseY, 80, 80); // Sun glow
}

function drawCloud(x, y) {
  fill(255);
  noStroke();
  ellipse(x, y, 50, 30);
  ellipse(x + 20, y - 10, 40, 30);
  ellipse(x + 40, y, 50, 30);
}

function drawStem(bx, by, fx, fy, bend) {
  stroke(100, 150, 50);
  strokeWeight(12);
  noFill();
  beginShape();
  vertex(bx, by);
  quadraticVertex(bx, by - stemHeight/2, fx, fy);
  endShape();
  
  // Large leaf
  push();
  translate(bx + (fx-bx)*0.4, by - 100);
  rotate(bend * 0.5);
  fill(80, 130, 40);
  noStroke();
  ellipse(0, 0, 80, 40);
  pop();
}

function drawPetals(scaleVal) {
  fill(255, 215, 0); // Bright Yellow
  stroke(218, 165, 32); // Golden border
  strokeWeight(1);
  let petalCount = 20;
  for (let i = 0; i < petalCount; i++) {
    push();
    rotate(i * (360 / petalCount));
    let pLen = 100 * scaleVal;
    ellipse(pLen/2 + 20, 0, pLen, 30 * scaleVal);
    pop();
  }
}

function drawSeeds(scaleVal) {
  fill(60, 40, 20); // Dark chocolate center
  noStroke();
  ellipse(0, 0, 90 * scaleVal, 90 * scaleVal);
  
  // Seed texture dots
  if (numSeeds < maxSeeds) numSeeds += 2;
  let angle = 137.5;
  let scalar = 3 * scaleVal;
  for (let i = 0; i < numSeeds; i++) {
    let phi = i * angle;
    let r = scalar * sqrt(i);
    fill(40, 20, 0);
    ellipse(r * cos(phi), r * sin(phi), 3 * scaleVal, 3 * scaleVal);
  }
}

function updateBee(tx, ty) {
  // Check if mouse is still to "land" the bee
  let mouseVel = dist(mouseX, mouseY, pmouseX, pmouseY);
  let target;
  
  if (mouseVel < 1) {
    target = createVector(tx + 20, ty + 20); // Land on flower center
  } else {
    target = createVector(mouseX - 40, mouseY + 40); // Chase the sun
  }
  
  beePos.x = lerp(beePos.x, target.x, 0.05);
  beePos.y = lerp(beePos.y, target.y, 0.05);

  push();
  translate(beePos.x, beePos.y);
  // Wings
  fill(255, 255, 255, 180);
  ellipse(-5, -5, 15, 10);
  ellipse(-5, 5, 15, 10);
  // Body
  fill(255, 200, 0);
  stroke(0);
  strokeWeight(1);
  ellipse(0, 0, 25, 18);
  // Stripes
  line(-2, -8, -2, 8);
  line(4, -8, 4, 8);
  // Eye & Stinger
  fill(0);
  ellipse(8, -2, 3, 3);
  line(-12, 0, -15, 0);
  pop();
}
