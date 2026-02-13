function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // THIS IS THE KEY: it stops high-res screens from changing the scale
  angleMode(DEGREES);
  initGarden();
}
let stemHeight = 0;
let maxStemHeight;
let bloomScale = 0;
let numSeeds = 0;
let maxSeeds = 200;

let clouds = [];
let raindrops = []; 
let beePos;
let lastTapTime = 0;

function setup() {
  // Fill the whole browser window
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  angleMode(DEGREES);
  initGarden();
}

function initGarden() {
  stemHeight = 0;
  bloomScale = 0;
  numSeeds = 0;
  // Make the stem height look good on any screen size
  maxStemHeight = height * 0.55; 
  beePos = createVector(-50, 100);
  clouds = [];
  for (let i = 0; i < 5; i++) {
    clouds.push({ x: random(width), y: random(height * 0.1, height * 0.3), speed: random(0.2, 0.5) });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxStemHeight = height * 0.55;
}

function mousePressed() {
  let currentTime = millis();
  if (currentTime - lastTapTime < 300) {
    initGarden();
  }
  lastTapTime = currentTime;
}

function draw() {
  drawSky();
  
  // Rain
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
    if (frameCount % 6 === 0) {
      raindrops.push({ x: c.x + random(-20, 60), y: c.y + 10, speed: random(4, 7) });
    }
  }

  // Draw Sun at Mouse/Touch
  drawSun(mouseX, mouseY);

  // Soil (Anchored to bottom)
  noStroke();
  fill(100, 75, 50); 
  rect(0, height - 60, width, 60);

  // Sunflower Physics
  if (stemHeight < maxStemHeight) stemHeight += 2;
  
  let bend = map(mouseX, 0, width, -width * 0.15, width * 0.15);
  let fx = width/2 + bend;
  let fy = height - 60 - stemHeight;

  drawStem(width/2, height-60, fx, fy, bend);

  if (stemHeight >= maxStemHeight) {
    if (bloomScale < 1.0) bloomScale += 0.01;
    push();
    translate(fx, fy);
    let headTilt = constrain(map(mouseX, 0, width, -35, 35), -35, 35);
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
  fill(255, 255, 255, 60);
  ellipse(x, y, 80, 80);
}

function drawCloud(x, y) {
  fill(210);
  noStroke();
  ellipse(x, y, 50, 30);
  ellipse(x + 20, y - 10, 40, 30);
  ellipse(x + 40, y, 50, 30);
}

function drawStem(bx, by, fx, fy, bend) {
  stroke(90, 140, 50);
  strokeWeight(width > 600 ? 14 : 10);
  noFill();
  beginShape();
  vertex(bx, by);
  quadraticVertex(bx, by - stemHeight/2, fx, fy);
  endShape();
}

function drawPetals(scaleVal) {
  fill(255, 215, 0); 
  stroke(218, 165, 32); 
  let pSize = width > 600 ? 110 : 80;
  for (let i = 0; i < 20; i++) {
    push();
    rotate(i * 18);
    ellipse(pSize/2 + 15, 0, pSize * scaleVal, (pSize/3.5) * scaleVal);
    pop();
  }
}

function drawSeeds(scaleVal) {
  fill(55, 35, 15);
  let sSize = width > 600 ? 95 : 65;
  ellipse(0, 0, sSize * scaleVal, sSize * scaleVal);
}

function updateBee(tx, ty) {
  let target = createVector(tx + 30, ty + 30);
  beePos.x = lerp(beePos.x, target.x, 0.05);
  beePos.y = lerp(beePos.y, target.y, 0.05);
  push();
  translate(beePos.x, beePos.y);
  fill(255, 210, 0);
  ellipse(0, 0, 22, 16);
  fill(0);
  rect(-2, -7, 2, 14);
  pop();
}
