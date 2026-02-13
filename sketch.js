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
  fill(80, 110, 140, 150); 
  beginShape();
  vertex(0, height - 60);
  bezierVertex(width * 0.2, height * 0.7, width * 0.4, height * 0.8, width * 0.6, height - 60);
  bezierVertex(width * 0.8, height * 0.6, width * 0.9, height * 0.7, width, height - 60);
  endShape(CLOSE);
}

function drawGround() {
  noStroke();
  fill(139, 94, 60); 
  rect(0, height - 60, width, 60);
  
  for(let i = 0; i < width; i += 15) {
    let sway = sin(i + frameCount * 2) * 3;
    fill(60, 100, 40);
    triangle(i, height - 60, i + 15, height - 60, i + 7 + sway, height - 75);
    
    if (i % 60 === 0) {
      fill(255, 255, 255, 200);
      ellipse(i + 7 + sway, height - 75, 5, 5);
      fill(255, 200, 0);
      ellipse(i + 7 + sway, height - 75, 2, 2);
    }
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

// --- Sunflower Components ---

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
    ellipse(0, 0, 40 * bloomScale + 20, 20 * bloomScale + 10);
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

// --- NEW REALISTIC BEE ---
function updateRealisticBee(tx, ty) {
  let target = createVector(tx + 40, ty + 20);
  beePos.x = lerp(beePos.x, target.x, 0.05);
  beePos.y = lerp(beePos.y, target.y, 0.05);
  
  let hoverX = sin(frameCount * 5) * 5;
  let hoverY = cos(frameCount * 5) * 5;

  push();
  translate(beePos.x + hoverX, beePos.y + hoverY);
  
  // Wings (Vibrating)
  fill(255, 255, 255, 120); 
  let wingVibrate = sin(frameCount * 40) * 15;
  push(); rotate(-30 + wingVibrate); ellipse(-5, -12, 18, 10); pop();
  push(); rotate(30 - wingVibrate); ellipse(-5, 12, 18, 10); pop();

  // Stinger
  fill(0);
  triangle(-15, 0, -10, -3, -10, 3);

  // Body stripes
  fill(255, 210, 0);
  ellipse(0, 0, 30, 22);
  fill(0);
  rect(-4, -10, 5, 20, 2);
  rect(5, -9, 4, 18, 2);
  
  // Head & Antennae
  fill(20);
  ellipse(12, 0, 14, 14);
  stroke(0);
  line(15, -5, 20, -12);
  line(15, 5, 20, 12);
  pop();

  if (frameCount % 10 === 0) {
    pollen.push({ x: beePos.x, y: beePos.y, vx: random(-1, 1), vy: random(1, 2), a: 200 });
  }
}

// --- Effects ---

function drawFallingPetals() {
  noStroke();
  fill(255, 215, 0, 180); 
  for (let i = petals.length - 1; i >= 0; i--) {
    let p = petals[i];
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    ellipse(0, 0, 15, 8);
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
    fill(255, 255, 0, p.a);
    ellipse(p.x, p.y, 3, 3);
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
  ellipse(-4, 0, 8, 8);
  ellipse(4, 0, 8, 8);
  triangle(-8, 0, 8, 0, 0, 10);
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
  let cardH = width > 600 ? 300 : 360; 
  fill(255, 253, 245);
  stroke(200, 180, 150);
  strokeWeight(3);
  rect(0, 0, cardW, cardH, 15);
  fill(50, 40, 20);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont('Georgia');
  textSize(width > 600 ? 18 : 15);
  text(myLetter, 0, 0, cardW - 50, cardH - 40);
  pop();
}
