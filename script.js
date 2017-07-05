let GLOBAL = {
  ballNum: 0,
  colorArray: ['#c00', 'blue', 'yellow', 'green', 'black'],
  ballArray: [],
  fps: 24,
  containerWidth: 800,
  containerHeight: 500,
  overlapSpeed: 50,
  intervalEngine: () => {}
};

/* utils */

const getElement = (name) => {
  return document.getElementsByClassName(name)[0];
};

const getDistance = (ballA, ballB) => {
  return Math.floor(
    Math.sqrt(
      Math.pow(ballA.left - ballB.left, 2) +
      Math.pow(ballA.top - ballB.top, 2)
    ));
};

const collisionCheckingAndExchangeSpeed = (ballA, ballB) => {
  if (getDistance(ballA, ballB) <= ballA.radius + ballB.radius) {
    let mA = ballA.mass,
      mB = ballB.mass;
    let vxA = ballA.speedX,
      vxB = ballB.speedX;
    let vyA = ballA.speedY,
      vyB = ballB.speedY;

    // x, y分量上都满足动量守恒，由速度交换公式有：
    ballA.speedX = ((mA - mB) / (mA + mB)) * vxA + (2 * mB / (mA + mB)) * vxB;
    ballB.speedX = ((mB - mA) / (mA + mB)) * vxB + (2 * mA / (mA + mB)) * vxA;

    ballA.speedY = ((mA - mB) / (mA + mB)) * vyA + (2 * mB / (mA + mB)) * vyB;
    ballB.speedY = ((mB - mA) / (mA + mB)) * vyB + (2 * mA / (mA + mB)) * vyA;
  }

};

/* Main Engine */

GLOBAL.interval = setInterval(() => {
  let array = GLOBAL.ballArray;
  array.forEach((item, index) => {
    item.move();
    for (let i = index + 1; i < array.length; i++) {
      collisionCheckingAndExchangeSpeed(item, array[i]);
    }
  });

}, Math.floor(1000 / GLOBAL.fps));

/* Ball Class */

class Ball {
  constructor(speedX, speedY, radius, mass) {
    this.speedX = speedX;
    this.speedY = speedY;
    this.mass = mass || 100;
    this.radius = radius || 50;
    this.left = GLOBAL.containerWidth / 2 - this.radius;
    this.top = 0;
    this.position = [this.left + this.radius, this.top + this.radius];
    this.serial = GLOBAL.ballNum++;
    this.newBall();
  }

  // create a ball
  newBall() {
    let newBall = document.createElement('div');
    newBall.className = 'circle';
    newBall.style.width = this.radius * 2 + 'px';
    newBall.style.height = this.radius * 2 + 'px';
    newBall.style.left = this.left + 'px';
    newBall.style.top = this.top + 'px';
    newBall.style.borderRadius = this.radius + 'px';
    newBall.style.backgroundColor = GLOBAL.colorArray[this.serial % 5];
    getElement('wrapper').appendChild(newBall);

    this.element = newBall;
  }

  // 移动一次，碰到上下边墙先修正位置，垂直方向速度再乘以-1，左右类似
  move() {
    this.left += this.speedX / Math.ceil(1000 / GLOBAL.fps);
    this.top += this.speedY / Math.ceil(1000 / GLOBAL.fps);

    let leftMin = 0,
      leftMax = GLOBAL.containerWidth - 2 * this.radius,
      topMin = 0,
      topMax = GLOBAL.containerHeight - 2 * this.radius;

    if ( this.left <= leftMin ) {
      this.left = leftMin;
      this.speedX = -this.speedX;
    } else if ( this.left >= leftMax ) {
      this.left = leftMax;
      this.speedX = -this.speedX;
    }

    if ( this.top <= topMin ) {
      this.top = topMin;
      this.speedY = -this.speedY;
    } else if ( this.top >= topMax ) {
      this.top = topMax;
      this.speedY = -this.speedY;
    }

    this.element.style.left = this.left + 'px';
    this.element.style.top = this.top + 'px';
  }

}

window.onload = function() {
  var wrapper = getElement('wrapper');
  wrapper.style.width = GLOBAL.containerWidth + 'px';
  wrapper.style.height = GLOBAL.containerHeight + 'px';
  getElement('bt-add').addEventListener('click', (e) => {
    GLOBAL.ballArray.push(new Ball(50, 50, 50, 100));
  });
  getElement('bt-stop').addEventListener('click', (e) => {
    clearInterval(GLOBAL.intervalEngine);
    GLOBAL.ballArray.forEach((item) => { item.speedX = 0; item.speedY = 0 });
  });
};
