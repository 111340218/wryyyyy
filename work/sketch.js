let objs = []; 
let colors = ['#0065CB', '#FF0042', '#758FE4', '#FB4103', '#26A692', '#FAAB0C', '#F9E000', '#FD9B85', '#f9f8f8'];
let bgMusic; // 背景音乐对象
let clickSound; // 点击音效
let amp; // 音量检测对象
let musicStarted = false; // 音乐是否开始播放的标志
let showMenu = false; // 菜单显示状态
let message = ""; // 消息内容

function preload() {
  bgMusic = loadSound('background_music.mp3'); // 加载背景音乐
  clickSound = loadSound('click_sound.mp3'); // 加载点击音效
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 全屏模式
  rectMode(CENTER);

  // 创建音量检测对象
  amp = new p5.Amplitude();
  
  // 启动背景音乐并让它循环播放
  bgMusic.loop();
}

function draw() {
  background('#021123');
  
  // 获取当前的音量
  let volume = amp.getLevel(); // 获取当前音量（范围从0到1）

  // 检测是否开始播放音乐
  if (!musicStarted && bgMusic.isPlaying()) {
    musicStarted = true; // 设置标志，表明音乐已开始播放
  }

  // 绘制粒子效果
  for (let i of objs) {
    i.show();
    i.move();
  }

  // 移除超出边界的粒子
  for (let i = 0; i < objs.length; i++) {
    if (objs[i].isDead) {
      objs.splice(i, 1);
    }
  }

  // 绘制菜单
  if (showMenu) {
    drawMenu();
  } else {
    drawHamburgerButton();
  }

  // 显示消息
  if (message) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(message, width / 2, height / 2);
  }
}

// 绘制滑动菜单
function drawMenu() {
  fill(0, 150);
  noStroke();
  rectMode(CORNER);
  rect(0, 0, 300, height); // 菜单背景

  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text("Close Menu", 20, 50);
  text("Show Text", 20, 100);
  text("Refresh", 20, 150);
  text(isMusicPlaying() ? "Stop Music" : "Play Music", 20, 200); // 改变按钮文本，根据音频状态显示 "Stop Music" 或 "Play Music"
}

// 绘制汉堡按钮
function drawHamburgerButton() {
  fill(255);
  noStroke();
  rect(25, 15, 40, 5, 2);
  rect(25, 25, 40, 5, 2);
  rect(25, 35, 40, 5, 2);
}

// 鼠标点击事件处理
function mousePressed() {
  if (showMenu) {
    if (mouseX > 0 && mouseX < 300) {
      if (mouseY > 30 && mouseY < 70) { // Close Menu
        showMenu = false;
      } else if (mouseY > 80 && mouseY < 120) { // Show Text
        message = "花花花!";
        setTimeout(() => (message = ""), 3000); // 3秒后清除消息
      } else if (mouseY > 130 && mouseY < 170) { // Refresh
        objs = []; // 清除所有粒子
        addObj(); // 添加一个新的粒子
      } else if (mouseY > 180 && mouseY < 220) { // Play / Stop Music
        toggleMusic(); // 切换音频播放
      }
    }
  } else {
    if (mouseX < 50 && mouseY < 50) { // 点击汉堡按钮
      showMenu = true;
    } else { 
      // 点击画布播放点击音效
      if (clickSound.isPlaying()) {
        clickSound.stop(); // 确保音效不会重叠
      }
      clickSound.play();
      // 在点击位置生成粒子
      addObj(mouseX, mouseY); 
    }
  }
}

// 添加粒子
function addObj(x = random(width), y = random(height)) {
  objs.push(new ROK(x, y, random(60, 120), 0)); // 使用鼠标点击位置生成粒子
}

// 切换背景音乐的播放和停止
function toggleMusic() {
  if (bgMusic.isPlaying()) {
    bgMusic.stop(); // 如果音乐正在播放，则停止
  } else {
    bgMusic.loop(); // 如果音乐没有播放，则开始并循环播放
  }
}

// 检查音乐是否正在播放
function isMusicPlaying() {
  return bgMusic.isPlaying();
}

// 窗口大小调整事件
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 动态调整画布大小
}

// 粒子类
class ROK {
  constructor(x, y, w, t) {
    this.x = x;
    this.y = y;
    this.w = w;

    this.bw1 = 0;
    this.ew1 = w;
    this.bw2 = 0;
    this.ew2 = w * random(0.1, 0.4);
    this.w1 = this.bw1;
    this.w2 = this.bw2;

    this.ptn = int(random(8, 30));
    this.ewh = random(0.2, 0.35);
    this.ehh = random(0.05, 0.1);
    this.esh = random(0.25, 0.35);

    this.t = t;
    this.t1 = 20;
    this.t2 = this.t1 + 30;
    this.t3 = this.t2 + 20;

    this.ang = random(10);

    this.col1 = random(colors);
    this.col2 = random(colors);

    this.as = random(-1, 1) * 0.02;
    this.ys = -width * 0.001;

    this.xs = random(-1, 1) * width * 0.001;

    this.isDead = false;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.ang);
    noStroke();
    fill(this.col1);
    for (let i = 0; i < this.ptn; i++) {
      rotate(TAU / this.ptn);
      ellipse(this.w1 * this.esh, 0, this.w1 * this.ewh, this.w1 * this.ehh);
    }
    fill(this.col2);
    circle(0, 0, this.w2);
    pop();
  }

  move() {
    if (0 < this.t && this.t < this.t2) {
      let n = norm(this.t, 0, this.t2 - 1);
      this.w2 = lerp(this.bw2, this.ew2, easeInOutQuart(n));
    }
    if (this.t1 < this.t && this.t < this.t3) {
      let n = norm(this.t, this.t1, this.t3 - 1);
      this.w1 = lerp(this.bw1, this.ew1, easeInOutQuart(n));
    }
    this.y += this.ys;
    this.ys += 0.02;

    if (this.y > height + this.w) {
      this.isDead = true;
    }
    this.t++;
    this.ang += this.as;
    this.x += this.xs;
  }
}

function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}
