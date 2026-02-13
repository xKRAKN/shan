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
let petals = [];   
let beePos;
let lastTapTime = 0;

// --- Letter & Heart Variables ---
let myLetter = "To Shashan,\n\nI really like you and that is why I want to know you more. I want you to know that I am always here when you need someone.\n\nJust like this sunflower, you make the world a little brighter. Keep blooming!\n\n— With love";
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
  petals = [];
  
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
  drawMountains(); 
  
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

  // 3. Ground & Grass
  drawGround(); 

  // 4. Sunflower Growth
  if (stemHeight < maxStemHeight) stemHeight += 2;
  
  let bend = map(mouseX, 0, width, -width * 0.1, width * 0.1);
  let fx = width/2 + bend;
  let fy = height - 60 - stemHeight;

  // Sunflower Shadow
  fill(0, 30);
  noStroke();
  ellipse(width/2, height - 60, 60 * bloomScale + 20, 10);

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
    
    if (showLetter && frameCount % 60 === 0) {
       petals.push({ 
         x: random(width), 
         y: -20, 
         speed: random(1, 2), 
         angle: random(360), 
         rotSpeed: random(1, 3),
         drift: random(-1, 1)
       });
    }
    drawFallingPetals();
  }

  if (showLetter) {
    drawSideLetter();
    drawPulsingHeart();
  }
}

// --- Background Components ---

function drawMountains() {
  noStroke();
  fill(70, 90, 120, 180); 
  beginShape();
  vertex(0, height - 60);
  bezierVertex(width * 0.2, height * 0.65, width * 0.4, height * 0.85, width * 0.5, height - 60);
  fill(85, 105, 135, 200);
  bezierVertex(width * 0.7, height * 0.55, width * 0.9, height * 0.75, width, height - 60);
  endShape(CLOSE);
}

function drawGround() {
  noStroke();
  // Soil with depth
  fill(100, 70, 45); 
  rect(0, height - 60, width, 60);
  fill(139, 94, 60);
  rect(0, height - 60, width, 15);
  
  for(let i = 0; i < width; i += 12) {
    let sway = sin(i + frameCount * 2) * 3;
    // Layered Grass
    fill(45, 85, 30);
    triangle(i, height - 60, i + 12, height - 60, i + 6 + sway, height - 78);
    fill(60, 110, 45);
    triangle(i + 4, height - 60, i + 10, height - 60, i + 7 + sway, height - 72);
    
    // Tiny Realistic Wildflowers
    if (i % 70 === 0) {
      let flowerColor = (i % 140 === 0) ? color(255, 100, 150) : color(100, 200, 255);
      drawTinyFlower(i + 7 + sway, height - 75, flowerColor);
    }
  }
}

function drawTinyFlower(x, y, c) {
  push();
  translate(x, y);
  fill(c);
  for(let i = 0; i < 5; i++) {
    rotate(72);
    ellipse(3, 0, 5, 3);
  }
  fill(255, 255, 0);
  ellipse(0, 0, 3, 3);
  pop();
}

// --- Sunflower Components (Realistic Colors) ---

function drawPetals(scaleVal) {
  let pSize = width > 600 ? 100 : 70;
  for (let i = 0; i < 24; i++) {
    push();
    rotate(i * 15);
    // Gradient effect: darker gold at base, bright yellow at tips
    fill(218, 165, 32); 
    ellipse(pSize/3 + 10, 0, pSize * scaleVal, (pSize/4) * scaleVal);
    fill(255, 225, 0);
    ellipse(pSize/2 + 20, 0, (pSize*0.8) * scaleVal, (pSize/5) * scaleVal);
    pop();
  }
}

function drawSeeds(scaleVal) {
  let sSize = width > 600 ? 95 : 65;
  // Deep brown core
  fill(40, 25, 10); 
  ellipse(0, 0, sSize * scaleVal, sSize * scaleVal);
  
  if (numSeeds < maxSeeds) numSeeds += 2;
  let angleStep = 137.5; 
  let scalar = (sSize / 31) * scaleVal;
  for (let i = 0; i < numSeeds; i++) {
    let r = scalar * sqrt(i);
    let theta = i * angleStep;
    // Seed variation
    fill(i % 5 === 0 ? 80 : 50, 30, 0);
    ellipse(r * cos(theta), r * sin(theta), 4 * scaleVal, 4 * scaleVal);
  }
}

// --- Realistic Bee Update ---

function updateRealisticBee(tx, ty) {
  let target = createVector(tx + 50, ty + 10);
  beePos.x = lerp(beePos.x, target.x, 0.04);
  beePos.y = lerp(beePos.y, target.y, 0.04);
  
  let hoverY = sin(frameCount * 8) * 6;

  // Bee Shadow on Flower
  fill(0, 40);
  noStroke();
  ellipse(beePos.x, beePos.y + 40, 20, 5);

  push();
  translate(beePos.x, beePos.y + hoverY);
  
  // Fuzzy Body Texture
  fill(255, 215, 0);
  ellipse(0, 0, 32, 24);
  fill(0);
  rect(-5, -11, 6, 22, 4); // Stripe 1
  rect(6, -9, 5, 18, 3);   // Stripe 2
  
  // Vibrating Transparent Wings
  fill(200, 230, 255, 100);
  let wingMove = sin(frameCount * 50) * 15;
  push(); rotate(-25 + wingMove); ellipse(-4, -14, 20, 10); pop();
  push(); rotate(25 - wingMove); ellipse(-4, 14, 20, 10); pop();
  
  // Head & Eyes
  fill(10);
  ellipse(14, 0, 16, 16);
  fill(255, 200);
  ellipse(18, -3, 4, 4); // Eye glint
  
  // Tiny Legs
  stroke(0);
  strokeWeight(1);
  line(-5, 10, -8, 15);
  line(5, 10, 8, 15);
  pop();

  if (frameCount % 12 === 0) {
    pollen.push({ x: beePos.x, y: beePos.y + hoverY, vx: random(-0.5, 0.5), vy: random(1, 2), a: 180 });
  }
}

// --- Rest of functions ---

function drawFallingPetals() {
  noStroke();
  for (let i = petals.length - 1; i >= 0; i--) {
    let p = petals[i];
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    fill(255, 215, 0, 180);
    ellipse(0, 0, 18, 9);
    fill(255, 255, 255, 50); // Hint of shine
    ellipse(-2, -2, 10, 3);
    pop();
    p.y += p.speed;
    p.x += p.drift + sin(frameCount) * 0.5;
    p.angle += p.rotSpeed;
    if (p.y > height) petals.splice(i, 1);
  }
}

function drawPollen() {
  noStroke();
  for (let i = pollen.length - 1; i >= 0; i--) {
    let p = pollen[i];
    fill(255, 255, 150, p.a);
    ellipse(p.x, p.y, 3, 3);
    p.y += p.vy;
    p.a -= 4;
    if (p.a <= 0) pollen.splice(i, 1);
  }
}

function drawPulsingHeart() {
  push();
  let pulse = map(sin(frameCount * 6), -1, 1, 0.8, 1.2);
  translate(beePos.x, beePos.y - 45);
  scale(pulse);
  fill(255, 60, 80);
  noStroke();
  ellipse(-5, 0, 10, 10);
  ellipse(5, 0, 10, 10);
  triangle(-10, 0, 10, 0, 0, 13);
  pop();
}

function drawDynamicSky() {
  let inter = map(mouseX, 0, width, 0, 1);
  background(lerpColor(color(110, 155, 195), color(255, 160, 110), inter));
}

function drawSun() {
  noStroke();
  fill(255, 240, 150, 150);
  ellipse(mouseX, mouseY, 90, 90);
  fill(255, 230, 0, 200);
  ellipse(mouseX, mouseY, 65, 65);
}

function drawCloud(x, y) {
  fill(255, 255, 255, 210);
  noStroke();
  ellipse(x, y, 60, 35);
  ellipse(x + 25, y - 15, 50, 40);
  ellipse(x + 50, y, 60, 35);
}

function drawStem(bx, by, fx, fy, bend) {
  stroke(80, 130, 40);
  strokeWeight(width > 600 ? 14 : 10);
  noFill();
  beginShape();
  vertex(bx, by);
  quadraticVertex(bx, by - stemHeight/2, fx, fy);
  endShape();
  
  if (stemHeight > 50) {
    push();
    let lx = lerp(bx, fx, 0.5);
    let ly = lerp(by, fy, 0.5);
    translate(lx, ly);
    rotate(bend - 45);
    fill(60, 110, 35);
    noStroke();
    ellipse(0, 0, 50 * bloomScale + 10, 25 * bloomScale + 5);
    pop();
  }
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
  let cardH = width > 600 ? 320 : 380; 
  
  // Shadow
  fill(0, 30);
  rect(8, 8, cardW, cardH, 15);
  
  fill(255, 254, 250);
  stroke(220, 200, 170);
  strokeWeight(4);
  rect(0, 0, cardW, cardH, 15);
  
  fill(60, 50, 30);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Georgia');
  textSize(width > 600 ? 19 : 16);
  text(myLetter, 0, 0, cardW - 60, cardH - 50);
  pop();
}
