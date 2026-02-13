function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // THIS IS THE KEY: it stops high-res screens from changing the scale
  angleMode(DEGREES);
  initGarden();
}
// --- Variables ---
let stemHeight = 0;
let maxStemHeight;
let bloomScale = 0;
let numSeeds = 0;
let maxSeeds = 200;

let clouds = [];
let raindrops = [];
let beePos;
let lastTapTime = 0;

// --- Letter & Heart Variables ---
let myLetter = "To someone special,\n\nJust like this sunflower,\nyou make the world a little brighter.\n\nKeep blooming!";
let letterScale = 0;
let showLetter = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); 
  angleMode(DEGREES);
  initGarden();
}

function initGarden() {
  stemHeight = 0;
  bloomScale = 0;
  numSeeds = 0;
  letterScale = 0;
  showLetter = false;
  maxStemHeight = height * 0.6; 
  beePos = createVector(-50, 100);
  
  clouds = [];
  for (let i = 0; i < 4; i++) {
    clouds.push({ x: random(width), y: random(50, 150), speed: random(0.2, 0.5) });
  }
}

function mousePressed() {
  let currentTime = millis();
  if (currentTime - lastTapTime < 300) {
    initGarden();
  }
  lastTapTime = currentTime;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxStemHeight = height * 0.6;
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

  // Clouds
  for (let c of clouds) {
    drawCloud(c.x, c.y);
    c.x += c.speed;
    if (c.x > width + 50) c.x = -100;
    if (frameCount % 5 === 0) {
      raindrops.push({ x: c.x + random(-20, 60), y: c.y + 10, speed: random(4, 7) });
    }
  }

  drawSun();

  // Soil
  noStroke();
  fill(139, 94, 60); 
  rect(0, height - 60, width, 60);

  // Sunflower Logic
  if (stemHeight < maxStemHeight) stemHeight += 2;
  
  let bend = map(mouseX, 0, width, -width * 0.1, width * 0.1);
  let fx = width/2 + bend;
  let fy = height - 60 - stemHeight;

  drawStem(width/2, height-60, fx, fy, bend);

  if (stemHeight >= maxStemHeight) {
    if (bloomScale < 1.0) {
      bloomScale += 0.01;
    } else {
      showLetter = true; 
    }
    
    push();
    translate(fx, fy);
    let headTilt = constrain(map(mouseX, 0, width, -30, 30), -30, 30);
    rotate(headTilt);
    drawPetals(bloomScale);
    drawSeeds(bloomScale);
    pop();

    updateRealisticBee(fx, fy);
  }

  if (showLetter) {
    drawSideLetter();
    drawPulsingHeart();
  }
}

function drawSky() { background(110, 155, 195); }

function drawSun() {
  fill(255, 230, 0, 180);
  noStroke();
  ellipse(mouseX, mouseY, 60, 60);
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
  strokeWeight(width > 600 ? 12 : 8);
  noFill();
  beginShape();
  vertex(bx, by);
  quadraticVertex(bx, by - stemHeight/2, fx, fy);
  endShape();
}

function drawPetals(scaleVal) {
  fill(255, 215, 0); 
  stroke(218, 165, 32); 
  let pSize = width > 600 ? 100 : 70;
  for (let i = 0; i < 20; i++) {
    push();
    rotate(i * 18);
    ellipse(pSize/2 + 20, 0, pSize * scaleVal, (pSize/3) * scaleVal);
    pop();
  }
}

function drawSeeds(scaleVal) {
  let sSize = width > 600 ? 90 : 60;
  fill(60, 40, 20); 
  noStroke();
  ellipse(0, 0, sSize * scaleVal, sSize * scaleVal);
}

// --- NEW ENHANCED FUNCTIONS ---

function updateRealisticBee(tx, ty) {
  let target = createVector(tx + 40, ty + 20);
  beePos.x = lerp(beePos.x, target.x, 0.05);
  beePos.y = lerp(beePos.y, target.y, 0.05);
  
  push();
  translate(beePos.x, beePos.y);
  
  // Wings (fluttering effect)
  fill(255, 255, 255, 150);
  stroke(200);
  let wingFlap = sin(frameCount * 20) * 10;
  push();
  rotate(wingFlap);
  ellipse(-5, -8, 15, 20); // Top wing
  pop();
  
  // Body (Yellow and Black stripes)
  noStroke();
  fill(255, 200, 0); // Yellow body
  ellipse(0, 0, 30, 20);
  
  fill(0); // Black stripes
  rect(-5, -9, 4, 18, 2);
  rect(3, -8, 4, 16, 2);
  
  // Head
  ellipse(12, 0, 12, 12);
  
  // Antennae
  stroke(0);
  strokeWeight(1);
  line(15, -4, 20, -10);
  line(15, 4, 20, 10);
  
  pop();
}

function drawPulsingHeart() {
  push();
  // Mathematical pulse using sin()
  // map converts the -1 to 1 range of sin into a 0.8 to 1.2 scale range
  let pulse = map(sin(frameCount * 5), -1, 1, 0.8, 1.2);
  
  translate(beePos.x, beePos.y - 30);
  scale(pulse);
  
  fill(255, 50, 50);
  noStroke();
  let hSize = 8;
  ellipse(-hSize/2, 0, hSize, hSize);
  ellipse(hSize/2, 0, hSize, hSize);
  triangle(-hSize, 0, hSize, 0, 0, hSize + 2);
  pop();
}

function drawSideLetter() {
  if (letterScale < 1.0) letterScale = lerp(letterScale, 1.0, 0.05);
  push();
  let posX = width > 800 ? width * 0.75 : width / 2;
  let posY = width > 800 ? height / 2 : height * 0.25;
  
  translate(posX, posY);
  scale(letterScale);
  rectMode(CENTER);
  fill(255, 253, 245);
  stroke(200, 180, 150);
  strokeWeight(3);
  let cardW = width > 600 ? 350 : width * 0.85;
  let cardH = width > 600 ? 220 : 180;
  rect(0, 0, cardW, cardH, 15);
  fill(50, 40, 20);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Georgia');
  textSize(width > 600 ? 18 : 14);
  text(myLetter, 0, 0, cardW - 40, cardH - 40);
  pop();
}
