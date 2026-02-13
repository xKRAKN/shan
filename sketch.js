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
let myLetter = "To Shashan,\n\nI really like you and that is why I want to know you more. I want you to know that I am always here when you need someone.\n\nJust like this sunflower, you make the world a little brighter. Keep blooming!";
let letterScale = 0;
let showLetter = false;

// --- Interaction State Variables ---
let letterOpened = false;    // Tracks if the envelope was clicked
let letterDismissed = false; // Tracks if the "X" button was clicked

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
  letterOpened = false;    // Reset for new growth
  letterDismissed = false; // Reset for new growth
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
  
  // 1. Double Tap to Reset
  if (currentTime - lastTapTime < 300) {
    initGarden();
  }
  lastTapTime = currentTime;

  // 2. Open Envelope Detection
  if (showLetter && !letterOpened) {
    let posX = width > 800 ? width * 0.75 : width / 2;
    let posY = width > 800 ? height / 2 : height * 0.35;
    if (dist(mouseX, mouseY, posX, posY) < 60) {
      letterOpened = true;
    }
  }

  // 3. Close Button Detection
  if (letterOpened && !letterDismissed) {
    let posX = width > 800 ? width * 0.75 : width / 2;
    let posY = width > 800 ? height / 2 : height * 0.35;
    let cardW = width > 600 ? 380 : width * 0.9;
    let cardH = width > 600 ? 300 : 360;
    let bx = posX + (cardW / 2) - 25;
    let by = posY - (cardH / 2) + 25;
    if (dist(mouseX, mouseY, bx, by) < 20) {
      letterDismissed = true;
    }
  }
}

function draw() {
  drawDynamicSky(); 
  drawMountains(); 
  
  // Rain Logic
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
    s.r += 2; s.a -= 10;
    if (s.a <= 0) splashes.splice(i, 1);
  }

  for (let c of clouds) {
    drawCloud(c.x, c.y);
    c.x += c.speed;
    if (c.x > width + 50) c.x = -100;
    if (frameCount % 5 === 0) {
      raindrops.push({ x: c.x + random(-20, 60), y: c.y + 10, speed: random(4, 7) });
    }
  }

  drawSun();
  drawGround(); 

  if (stemHeight < maxStemHeight) stemHeight += 2;
  
  let bend = map(mouseX, 0, width, -width * 0.1, width * 0.1);
  let fx = width/2 + bend;
  let fy = height - 60 - stemHeight;

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
       petals.push({ x: random(width), y: -20, speed: random(1, 2), angle: random(360), rotSpeed: random(1, 3), drift: random(-1, 1)});
    }
    drawFallingPetals();
  }

  // Handle Letter States
  if (showLetter) {
    if (!letterOpened) {
      drawClosedEnvelope(); // Waiting for click
    } else if (!letterDismissed) {
      drawSideLetter();     // Original Letter function
      drawPulsingHeart();   // Original Heart function
      drawCloseButton();    // New Close Button
    }
  }
}

// --- NEW UI FUNCTIONS ---

function drawClosedEnvelope() {
  push();
  let posX = width > 800 ? width * 0.75 : width / 2;
  let posY = width > 800 ? height / 2 : height * 0.35;
  let hover = sin(frameCount * 3) * 8;
  translate(posX, posY + hover);
  
  rectMode(CENTER);
  fill(255, 245, 200);
  stroke(200, 180, 150);
  strokeWeight(2);
  rect(0, 0, 100, 70, 5);
  
  line(-50, -35, 0, 0);
  line(50, -35, 0, 0);
  
  noStroke();
  fill(100, 80, 50);
  textAlign(CENTER);
  textSize(14);
  text("Tap to open", 0, 55);
  
  fill(255, 100, 100);
  ellipse(-3, 0, 8, 8);
  ellipse(3, 0, 8, 8);
  triangle(-7, 0, 7, 0, 0, 8);
  pop();
}

function drawCloseButton() {
  push();
  let posX = width > 800 ? width * 0.75 : width / 2;
  let posY = width > 800 ? height / 2 : height * 0.35;
  let cardW = width > 600 ? 380 : width * 0.9;
  let cardH = width > 600 ? 300 : 360;
  translate(posX, posY);
  scale(letterScale);
  
  let bx = (cardW / 2) - 25;
  let by = -(cardH / 2) + 25;
  
  fill(230, 200, 180);
  noStroke();
  ellipse(bx, by, 30, 30);
  
  stroke(100, 50, 50);
  strokeWeight(3);
  line(bx - 7, by - 7, bx + 7, by + 7);
  line(bx + 7, by - 7, bx - 7, by + 7);
  pop();
}

// --- YOUR ORIGINAL FUNCTIONS (UNTOUCHED) ---

function drawMountains() {
  noStroke();
  fill(70, 90, 120, 150); 
  beginShape();
  vertex(0, height - 60);
  bezierVertex(width * 0.2, height * 0.7, width * 0.4, height * 0.8, width * 0.5, height - 60);
  fill(85, 105, 135, 180);
  bezierVertex(width * 0.7, height * 0.6, width * 0.9, height * 0.7, width, height - 60);
  endShape(CLOSE);
}

function drawGround() {
  noStroke();
  fill(110, 80, 50); 
  rect(0, height - 60, width, 60);
  for(let i = 0; i < width; i += 12) {
    let sway = sin(i + frameCount * 2) * 3;
    fill(45, 85, 30); 
    triangle(i, height - 60, i + 12, height - 60, i + 6 + sway, height - 78);
    if (i % 72 === 0) {
      let fCol = (i % 144 === 0) ? color(255, 150, 180) : color(150, 200, 255);
      push();
      translate(i + 7 + sway, height - 75);
      fill(fCol);
      for(let j=0; j<5; j++) { rotate(72); ellipse(3, 0, 5, 3); }
      fill(255, 255, 0); ellipse(0, 0, 3, 3);
      pop();
    }
  }
}

function updateRealisticBee(tx, ty) {
  let target = createVector(tx + 45, ty + 15);
  beePos.x = lerp(beePos.x, target.x, 0.05);
  beePos.y = lerp(beePos.y, target.y, 0.05);
  let hover = sin(frameCount * 8) * 5;
  push();
  translate(beePos.x, beePos.y + hover);
  fill(255, 255, 255, 120);
  let v = sin(frameCount * 50) * 15;
  push(); rotate(-25 + v); ellipse(-4, -12, 18, 10); pop();
  push(); rotate(25 - v); ellipse(-4, 12, 18, 10); pop();
  fill(255, 210, 0); ellipse(0, 0, 30, 22);
  fill(0); rect(-4, -10, 5, 20, 3); rect(6, -9, 4, 18, 3);
  fill(20); ellipse(13, 0, 15, 15);
  fill(255, 220); ellipse(16, -3, 3, 3);
  pop();
  if (frameCount % 10 === 0) {
    pollen.push({ x: beePos.x, y: beePos.y + hover, vx: random(-1, 1), vy: random(1, 2), a: 200 });
  }
}

function drawPetals(scaleVal) {
  let pSize = width > 600 ? 100 : 70;
  for (let i = 0; i < 24; i++) {
    push(); rotate(i * 15);
    fill(218, 165, 32); 
    ellipse(pSize/3 + 10, 0, pSize * scaleVal, (pSize/4) * scaleVal);
    fill(255, 220, 0);
    ellipse(pSize/2 + 20, 0, (pSize*0.8) * scaleVal, (pSize/5) * scaleVal);
    pop();
  }
}

function drawFallingPetals() {
  noStroke();
  fill(255, 215, 0, 160);
  for (let i = petals.length - 1; i >= 0; i--) {
    let p = petals[i];
    push(); translate(p.x, p.y); rotate(p.angle);
    ellipse(0, 0, 16, 8); pop();
    p.y += p.speed; p.x += p.drift + sin(frameCount) * 0.5; p.angle += p.rotSpeed;
    if (p.y > height) petals.splice(i, 1);
  }
}

function drawDynamicSky() {
  let inter = map(mouseX, 0, width, 0, 1);
  background(lerpColor(color(110, 155, 195), color(255, 150, 100), inter));
}

function drawSun() {
  fill(255, 230, 0, 180); noStroke();
  ellipse(mouseX, mouseY, 60, 60);
  fill(255, 255, 255, 80); ellipse(mouseX, mouseY, 80, 80); 
}

function drawCloud(x, y) {
  fill(210, 210, 210, 200); noStroke();
  ellipse(x, y, 50, 30); ellipse(x + 20, y - 10, 40, 30); ellipse(x + 40, y, 50, 30);
}

function drawStem(bx, by, fx, fy, bend) {
  stroke(100, 150, 50); strokeWeight(width > 600 ? 12 : 8); noFill();
  beginShape(); vertex(bx, by); quadraticVertex(bx, by - stemHeight/2, fx, fy); endShape();
  if (stemHeight > 50) {
    noStroke(); fill(80, 130, 40);
    push();
    let lx1 = lerp(bx, fx, 0.4); let ly1 = lerp(by, fy, 0.4);
    translate(lx1, ly1); rotate(bend - 45);
    ellipse(0, 0, (width > 600 ? 60 : 40) * bloomScale + 20, (width > 600 ? 30 : 20) * bloomScale + 10);
    pop();
  }
}

function drawSeeds(scaleVal) {
  let sSize = width > 600 ? 90 : 60;
  fill(60, 40, 20); noStroke();
  ellipse(0, 0, sSize * scaleVal, sSize * scaleVal);
  if (numSeeds < maxSeeds) numSeeds += 2;
  let angleStep = 137.5; 
  let scalar = (sSize / 30) * scaleVal;
  for (let i = 0; i < numSeeds; i++) {
    let r = scalar * sqrt(i); let theta = i * angleStep;
    fill(40, 20, 0); ellipse(r * cos(theta), r * sin(theta), 4 * scaleVal, 4 * scaleVal);
  }
}

function drawPollen() {
  noStroke();
  for (let i = pollen.length - 1; i >= 0; i--) {
    let p = pollen[i];
    fill(255, 255, 0, p.a); ellipse(p.x, p.y, 3, 3);
    p.y += p.vy; p.a -= 5;
    if (p.a <= 0) pollen.splice(i, 1);
  }
}

function drawPulsingHeart() {
  push();
  let pulse = map(sin(frameCount * 6), -1, 1, 0.8, 1.2);
  translate(beePos.x, beePos.y - 35);
  scale(pulse); fill(255, 50, 50); noStroke();
  ellipse(-4, 0, 8, 8); ellipse(4, 0, 8, 8); triangle(-8, 0, 8, 0, 0, 10);
  pop();
}

function drawSideLetter() {
  if (letterScale < 1.0) letterScale = lerp(letterScale, 1.0, 0.05);
  push();
  let posX = width > 800 ? width * 0.75 : width / 2;
  let posY = width > 800 ? height / 2 : height * 0.35;
  translate(posX, posY); scale(letterScale); rectMode(CENTER);
  let cardW = width > 600 ? 380 : width * 0.9;
  let cardH = width > 600 ? 300 : 360; 
  fill(0, 20); rect(5, 5, cardW, cardH, 15);
  fill(255, 253, 245); stroke(200, 180, 150); strokeWeight(3);
  rect(0, 0, cardW, cardH, 15);
  fill(50, 40, 20); noStroke(); textAlign(CENTER, CENTER); textFont('Georgia');
  textSize(width > 600 ? 18 : 15);
  text(myLetter, 0, 0, cardW - 50, cardH - 40);
  pop();
}
