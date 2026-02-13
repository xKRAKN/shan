let stemHeight = 0;
let maxStemHeight; // We will calculate this based on screen height
let bloomScale = 0;
let numSeeds = 0;
let maxSeeds = 200;

let clouds = [];
let raindrops = []; 
let beePos;

function setup() {
  // Use windowWidth and windowHeight to fill the phone screen
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  angleMode(DEGREES);
  
  maxStemHeight = height * 0.6; // Stem grows to 60% of screen height
  beePos = createVector(-50, 100);
  
  // Initialize drifting clouds
  for (let i = 0; i < 4; i++) {
    clouds.push({ x: random(width), y: random(50, 150), speed: random(0.2, 0.5) });
  }
}

// This function fixes the layout if the phone is rotated
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxStemHeight = height * 0.6;
}

function draw() {
  drawSky();
  
  // Rain Logic
  stroke(174, 194, 224, 150); 
  strokeWeight(2);
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let r = raindrops[i];
    line(r.x, r.y, r.x, r.y + 10);
    r.y += r.speed;
    if (r.y > height - 60) raindrops.splice(i, 1);
  }

  for (let c of clouds) {
    drawCloud(c.x, c.y);
    c.x += c.speed;
    if (c.x > width + 50) c.x = -100;
    if (frameCount % 5 === 0) {
      raindrops.push({ x: c.x + random(-20, 60), y: c.y + 10, speed: random(4, 7) });
    }
  }

  // On mobile, touchX/touchY replaces mouseX/mouseY automatically in p5.js
  drawSun(mouseX, mouseY);

  // Soil
  noStroke();
  fill(139, 94, 60); 
  rect(0, height - 60, width, 60);

  // Sunflower Growth
  if (stemHeight < maxStemHeight) stemHeight += 2;
  
  // Use the center of the screen as the base
  let bend = map(mouseX, 0, width, -width * 0.1, width * 0.1);
  let fx = width/2 + bend;
  let fy = height - 60 - stemHeight;

  drawStem(width/2, height-60, fx, fy, bend);

  if (stemHeight >= maxStemHeight) {
    if (bloomScale < 1.0) bloomScale += 0.01;
    
    push();
    translate(fx, fy);
    let headTilt = constrain(map(mouseX, 0, width, -30, 30), -30, 30);
    rotate(headTilt);
    
    drawPetals(bloomScale);
    drawSeeds(bloomScale);
    pop();

    updateBee(fx, fy);
  }
}

function drawSky() { background(110, 155, 195); }

function drawSun(x, y) {
  fill(255, 230, 0, 180);
  noStroke();
  ellipse(x, y, 60, 60);
}

function drawCloud(x, y) {
  fill(210);
  noStroke();
  ellipse(x, y, 50, 30);
  ellipse(x + 20, y - 10, 40, 30);
  ellipse(x + 40, y, 50, 30);
}

function drawStem(bx, by, fx, fy, bend) {
  stroke(100, 150, 50);
  strokeWeight(width > 500 ? 12 : 8); // Thinner stem on small screens
  noFill();
  beginShape();
  vertex(bx, by);
  quadraticVertex(bx, by - stemHeight/2, fx, fy);
  endShape();
}

function drawPetals(scaleVal) {
  fill(255, 215, 0); 
  stroke(218, 165, 32); 
  strokeWeight(1);
  let petalCount = 20;
  // Make petals smaller on mobile
  let petalSize = width > 500 ? 100 : 70; 
  for (let i = 0; i < petalCount; i++) {
    push();
    rotate(i * (360 / petalCount));
    let pLen = petalSize * scaleVal;
    ellipse(pLen/2 + 15, 0, pLen, (petalSize/3) * scaleVal);
    pop();
  }
}

function drawSeeds(scaleVal) {
  let centerSize = width > 500 ? 90 : 60;
  fill(60, 40, 20); 
  noStroke();
  ellipse(0, 0, centerSize * scaleVal, centerSize * scaleVal);
}

function updateBee(tx, ty) {
  let target = createVector(tx, ty + 40);
  beePos.x = lerp(beePos.x, target.x, 0.05);
  beePos.y = lerp(beePos.y, target.y, 0.05);
  push();
  translate(beePos.x, beePos.y);
  fill(255, 200, 0);
  ellipse(0, 0, 20, 14);
  pop();
}
