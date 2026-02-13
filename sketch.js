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
let maxSeeds = 250; 

let clouds = [];
let raindrops = [];
let splashes = []; 
let pollen = [];   
let beePos;
let lastTapTime = 0;

// --- Letter & Heart Variables ---
let myLetter = "To Shashan,\n\nI really like you and that is why I want to know you more. I want you to know that I am always here when you need someone.\n\nJust like this sunflower, you make the world a little brighter. Keep blooming!";
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
  raindrops = [];
  splashes = [];
  pollen = [];
  
  clouds = [];
  for (let i = 0; i < 4; i++) {
    clouds.push({ x: random(width), y: random(50, 150), speed: random(0.2, 0.5) });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxStemHeight = height * 0.6;
}

function mousePressed() {
  let currentTime = millis();
  if (currentTime - lastTapTime < 300) {
    initGarden();
  }
  lastTapTime = currentTime;
}

function draw() {
  drawDynamicSky(); 
  
  // 1. Rain & Splash Logic
  strokeWeight(2);
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let r = raindrops[i];
    stroke(174, 194, 224, 150);
    line(r.x, r.y, r.x, r.y + 10);
    r.y += r.speed;
    
    if (r.y > height - 60) {
      splashes.push({ x: r.x, y: height - 60, r: 1, a: 255 });
      raindrops.splice(i, 1);
    }
  }
  
  noFill();
  for (let i = splashes.length - 1; i >= 0; i--) {
    let s = splashes[i];
    stroke(255, s.a);
    ellipse(s.x, s.y, s.r, s.r/2);
    s.r += 2;
    s.a -= 10;
    if (s.a <= 0) splashes.splice(i, 1);
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

  // 3. Soil
  noStroke();
  fill(139, 94, 60); 
  rect(0, height - 60, width, 60);
  fill(0, 0, 0, 50); 
  for(let i=0; i<width; i+=20) ellipse(i + (frameCount%20), height-30, 5, 5);

  // 4. Sunflower Growth
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
    drawPollen(); 
  }

  if (showLetter) {
    drawSideLetter();
    drawPulsingHeart();
  }
}

function drawDynamicSky() {
  let inter = map(mouseX, 0, width, 0, 1);
  let c1 = color(110, 155, 195); 
  let c2 = color(255, 150, 100); 
  let bg = lerpColor(c1, c2, inter);
  background(bg);
}

function drawSun() {
  fill(255, 230, 0, 180);
  noStroke();
  ellipse(mouseX, mouseY, 60, 60);
  fill(255, 255, 255, 80);
  ellipse(mouseX, mouseY, 80, 80); 
}

function drawCloud(x, y) {
  fill(210, 210, 210, 200);
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

  if (stemHeight > 50) {
    noStroke();
    fill(80, 130, 40);
    push();
    let lx1 = lerp(bx, fx, 0.4);
    let ly1 = lerp(by, fy, 0.4);
    translate(lx1, ly1);
    rotate(bend - 45);
    ellipse(0, 0, (width > 600 ? 60 : 40) * bloomScale + 20, (width > 600 ? 30 : 20) * bloomScale + 10);
    pop();
    push();
    let lx2 = lerp(bx, fx, 0.7);
    let ly2 = lerp(by, fy, 0.7);
    translate(lx2, ly2);
    rotate(bend + 45);
    ellipse(0, 0, (width > 600 ? 50 : 35) * bloomScale + 15, (width > 600 ? 25 : 15) * bloomScale + 8);
    pop();
  }
}

function drawPetals(scaleVal) {
  fill(255, 215, 0); 
  stroke(218, 165, 32); 
  strokeWeight(1);
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
  for (let i = 8; i > 0; i--) {
    fill(255, 255, 100, 12 - i);
    ellipse(0, 0, (sSize * scaleVal) + (i * 8));
  }
  fill(60, 40, 20); 
  noStroke();
  ellipse(0, 0, sSize * scaleVal, sSize * scaleVal);
  if (numSeeds < maxSeeds) numSeeds += 2;
  let angleStep = 137.5; 
  let scalar = (sSize / 30) * scaleVal;
  for (let i = 0; i < numSeeds; i++) {
    let r = scalar * sqrt(i);
    let theta = i * angleStep;
    fill(40, 20, 0);
    ellipse(r * cos(theta), r * sin(theta), 4 * scaleVal, 4 * scaleVal);
  }
}

function updateRealisticBee(tx, ty) {
  let target = createVector(tx + 40, ty + 20);
  beePos.x = lerp(beePos.x, target.x, 0.05);
  beePos.y = lerp(beePos.y, target.y, 0.05);
  if (frameCount % 10 === 0) {
    pollen.push({ x: beePos.x, y: beePos.y, vx: random(-1, 1), vy: random(0, 2), a: 200 });
  }
  push();
  translate(beePos.x, beePos.y);
  fill(255, 255, 255, 160);
  let wingFlap = sin(frameCount * 30) * 15;
  push(); rotate(wingFlap); ellipse(-5, -10, 12, 18); pop();
  push(); rotate(-wingFlap); ellipse(-5, 10, 12, 18); pop();
  noStroke();
  fill(255, 210, 0);
  ellipse(0, 0, 28, 18);
  fill(0); 
  rect(-4, -8, 4, 16, 2);
  rect(3, -7, 4, 14, 2);
  ellipse(12, 0, 10, 10);
  pop();
}

function drawPollen() {
  noStroke();
  for (let i = pollen.length - 1; i >= 0; i--) {
    let p = pollen[i];
    fill(255, 255, 0, p.a);
    ellipse(p.x, p.y, 3, 3);
    p.x += p.vx;
    p.y += p.vy;
    p.a -= 5;
    if (p.a <= 0) pollen.splice(i, 1);
  }
}

function drawPulsingHeart() {
  push();
  let pulse = map(sin(frameCount * 6), -1, 1, 0.8, 1.2);
  translate(beePos.x, beePos.y - 35);
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
  let posY = width > 800 ? height / 2 : height * 0.35;
  translate(posX, posY);
  scale(letterScale);
  rectMode(CENTER);

  let cardW = width > 600 ? 380 : width * 0.9;
  textFont('Georgia');
  textSize(width > 600 ? 18 : 16);
  
  // Calculate height based on message length
  let wrapWidth = cardW - 50;
  let cardH = width > 600 ? 280 : 320; 

  // Shadow
  fill(0, 20);
  rect(5, 5, cardW, cardH, 15);

  // Card
  fill(255, 253, 245);
  stroke(200, 180, 150);
  strokeWeight(3);
  rect(0, 0, cardW, cardH, 15);
  
  // Text
  fill(50, 40, 20);
  noStroke();
  textAlign(CENTER, CENTER);
  text(myLetter, 0, 0, wrapWidth, cardH - 40);
  pop();
}
