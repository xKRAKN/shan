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

// --- Letter Variables (Customize your message here!) ---
let myLetter = "To someone special,\n\nJust like this sunflower,\nyou make the world a little brighter.\n\nKeep blooming!";
let letterScale = 0;
let showLetter = false;

function setup() {
  // Use windowWidth/Height for full background
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
  maxStemHeight = height * 0.6; // Responsive height
  beePos = createVector(-50, 100);
  
  clouds = [];
  for (let i = 0; i < 4; i++) {
    clouds.push({ x: random(width), y: random(50, 150), speed: random(0.2, 0.5) });
  }
}

// Reset on Double Tap or Double Click
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
  
  // 1. Rain Logic
  stroke(174, 194, 224, 150); 
  strokeWeight(2);
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let r = raindrops[i];
    line(r.x, r.y, r.x, r.y + 10);
    r.y += r.speed;
    if (r.y > height - 60) raindrops.splice(i, 1);
  }

  // 2. Clouds
  for (let c of clouds) {
    drawCloud(c.x, c.y);
    c.x += c.speed;
    if (c.x > width + 50) c.x = -100;
    if (frameCount % 5 === 0) {
      raindrops.push({ x: c.x + random(-20, 60), y: c.y + 10, speed: random(4, 7) });
    }
  }

  drawSun();

  // 3. Soil (Fixed to bottom)
  noStroke();
  fill(139, 94, 60); 
  rect(0, height - 60, width, 60);
  fill(0, 0, 0, 50); 
  for(let i=0; i<width; i+=20) ellipse(i + (frameCount%20), height-30, 5, 5);

  // 4. Sunflower Logic
  if (stemHeight < maxStemHeight) stemHeight += 2;
  
  let bend = map(mouseX, 0, width, -width * 0.1, width * 0.1);
  let fx = width/2 + bend;
  let fy = height - 60 - stemHeight;

  drawStem(width/2, height-60, fx, fy, bend);

  if (stemHeight >= maxStemHeight) {
    if (bloomScale < 1.0) {
      bloomScale += 0.01;
    } else {
      showLetter = true; // Trigger letter after bloom
    }
    
    push();
    translate(fx, fy);
    let headTilt = constrain(map(mouseX, 0, width, -30, 30), -30, 30);
    rotate(headTilt);
    
    drawPetals(bloomScale);
    drawSeeds(bloomScale);
    pop();

    updateBee(fx, fy);
  }

  // 5. Letter Pop-up
  if (showLetter) {
    drawPopUpLetter();
  }
}

function drawSky() { background(110, 155, 195); }

function drawSun() {
  fill(255, 230, 0, 180);
  noStroke();
  ellipse(mouseX, mouseY, 60, 60);
  fill(255, 255, 255, 80);
  ellipse(mouseX, mouseY, 80, 80); 
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
  strokeWeight(width > 600 ? 12 : 8); // Scale thickness
  noFill();
  beginShape();
  vertex(bx, by);
  quadraticVertex(bx, by - stemHeight/2, fx, fy);
  endShape();
  
  push();
  translate(bx + (fx-bx)*0.4, by - 100);
  rotate(bend * 0.5);
  fill(80, 130, 40);
  noStroke();
  ellipse(0, 0, 80, 40);
  pop();
}

function drawPetals(scaleVal) {
  fill(255, 215, 0); 
  stroke(218, 165, 32); 
  strokeWeight(1);
  let petalCount = 20;
  let pSize = width > 600 ? 100 : 70; // Scale petal size
  for (let i = 0; i < petalCount; i++) {
    push();
    rotate(i * (360 / petalCount));
    let pLen = pSize * scaleVal;
    ellipse(pLen/2 + 20, 0, pLen, (pSize/3) * scaleVal);
    pop();
  }
}

function drawSeeds(scaleVal) {
  let sSize = width > 600 ? 90 : 60;
  fill(60, 40, 20); 
  noStroke();
  ellipse(0, 0, sSize * scaleVal, sSize * scaleVal);
  
  if (numSeeds < maxSeeds) numSeeds += 2;
  let angle = 137.5;
  let scalar = (sSize/30) * scaleVal;
  for (let i = 0; i < numSeeds; i++) {
    let phi = i * angle;
    let r = scalar * sqrt(i);
    fill(40, 20, 0);
    ellipse(r * cos(phi), r * sin(phi), 3 * scaleVal, 3 * scaleVal);
  }
}

function updateBee(tx, ty) {
  let target = createVector(tx, ty + 40);
  beePos.x = lerp(beePos.x, target.x, 0.05);
  beePos.y = lerp(beePos.y, target.y, 0.05);
  push();
  translate(beePos.x, beePos.y);
  fill(255, 255, 255, 180);
  ellipse(-5, -5, 15, 10);
  ellipse(-5, 5, 15, 10);
  fill(255, 200, 0);
  stroke(0);
  ellipse(0, 0, 25, 18);
  pop();
}

function drawPopUpLetter() {
  if (letterScale < 1.0) letterScale = lerp(letterScale, 1.0, 0.05);
  push();
  translate(width / 2, height / 2);
  scale(letterScale);
  rectMode(CENTER);
  fill(255, 253, 245);
  stroke(200, 180, 150);
  strokeWeight(3);
  let cardW = width > 600 ? 400 : width * 0.85;
  let cardH = width > 600 ? 250 : 200;
  rect(0, 0, cardW, cardH, 15);
  fill(50, 40, 20);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Georgia');
  textSize(width > 600 ? 22 : 16);
  text(myLetter, 0, 0, cardW - 40, cardH - 40);
  pop();
}
