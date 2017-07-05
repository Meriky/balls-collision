let GLOBAL = {
  ballNum: 0,
  colorArray: ['#c00', 'blue', 'yellow', 'green', 'black'],
  ballArray: [],
  fps: 60,
  radius: 50,
  containerWidth: 800,
  containerHeight: 500,
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

const collisionCheckingAndExchangevelocity = (ballA, ballB) => {
  let distance = getDistance(ballA, ballB);
  /* eslint-disable */
  if (distance <= ballA.radius + ballB.radius && (!ballA.stick[ballB.serial] || !ballB.stick[ballA.serial])) {
    ballA.stick[ballB.serial] = true;
    ballB.stick[ballA.serial] = true;
    let dx = ballA.left - ballB.left;
    let dy = ballA.top - ballB.top;

    let vxA = ballA.velocityX,
      vxB = ballB.velocityX,
      vyA = ballA.velocityY,
      vyB = ballB.velocityY;
    let collisionDirection = Math.atan2(dy, dx);
    let velocityMagA = Math.sqrt(vxA * vxA + vyA * vyA);
    let velocityMagB = Math.sqrt(vxB * vxB + vyB * vyB);
    let velocityDirectionA = Math.atan2(vyA, vxA);
    let velocityDirectionB = Math.atan2(vyB, vxB);
    let newVXA = velocityMagA * Math.cos(velocityDirectionA - collisionDirection);
    let newVYA = velocityMagA * Math.sin(velocityDirectionA - collisionDirection);
    let newVXB = velocityMagB * Math.cos(velocityDirectionB - collisionDirection);
    let newVYB = velocityMagB * Math.sin(velocityDirectionB - collisionDirection);
    let updatedVXA = ((ballA.mass - ballB.mass) * newVXA + (ballB.mass + ballB.mass) * newVXB) / (ballA.mass + ballB.mass);
    let updatedVXB = (2 * ballA.mass * newVXA + (ballB.mass - ballA.mass) * newVXB) / (ballA.mass + ballB.mass);
    let updatedVYA = newVYA;
    let updatedVYB = newVYB;
    ballA.velocityX = Math.cos(collisionDirection) * updatedVXA + Math.cos(collisionDirection + Math.PI / 2) * updatedVYA;
    ballA.velocityY = Math.sin(collisionDirection) * updatedVXA + Math.sin(collisionDirection + Math.PI / 2) * updatedVYA;
    ballB.velocityX = Math.cos(collisionDirection) * updatedVXB + Math.cos(collisionDirection + Math.PI / 2) * updatedVYB;
    ballB.velocityY = Math.sin(collisionDirection) * updatedVXB + Math.sin(collisionDirection + Math.PI / 2) * updatedVYB;
    /* eslint-enable */
  } else {
    ballA.stick[ballB.serial] = false;
    ballB.stick[ballA.serial] = false;
  }

};

/* Main Engine */

GLOBAL.interval = setInterval(() => {
  let array = GLOBAL.ballArray;
  array.forEach((item, index) => {
    item.move();
    for (let i = index + 1; i < array.length; i++) {
      collisionCheckingAndExchangevelocity(item, array[i]);
    }
  });

}, Math.floor(1000 / GLOBAL.fps));

/* Ball Class */

class Ball {
  constructor(velocityX, velocityY, left, top, radius, mass) {
    this.velocityX = velocityX || 0;
    this.velocityY = velocityY || 0;
    this.mass = mass || 100;
    this.radius = radius || 50;
    this.left = left || (GLOBAL.containerWidth / 2 - this.radius);
    this.top = top || 0;
    this.position = [this.left + this.radius, this.top + this.radius];
    this.serial = GLOBAL.ballNum++;
    this.stick = [];
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
    this.left += this.velocityX / (1000 / GLOBAL.fps);
    this.top += this.velocityY / (1000 / GLOBAL.fps);

    let leftMin = 0,
      leftMax = GLOBAL.containerWidth - 2 * this.radius,
      topMin = 0,
      topMax = GLOBAL.containerHeight - 2 * this.radius;

    if ( this.left <= leftMin ) {
      this.left = leftMin;
      this.velocityX = -this.velocityX;
    } else if ( this.left >= leftMax ) {
      this.left = leftMax;
      this.velocityX = -this.velocityX;
    }

    if ( this.top <= topMin ) {
      this.top = topMin;
      this.velocityY = -this.velocityY;
    } else if ( this.top >= topMax ) {
      this.top = topMax;
      this.velocityY = -this.velocityY;
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
    let position = {
      left: 0,
      top: 0
    };

    while (1) {
      const radius = GLOBAL.radius;
      const length = GLOBAL.ballArray.length;
      let flag = true;
      position.left = Math.floor(Math.random() * (GLOBAL.containerWidth - 2 * radius)) + radius;
      position.top = Math.floor(Math.random() * (GLOBAL.containerHeight - 2 * radius)) + radius;
      for (let i = 0; i < length; i++) {
        if (getDistance(GLOBAL.ballArray[i], position) < 2 * radius) {
          flag = false;
          break;
        }
      }
      if (flag === true) break;
    }
    GLOBAL.ballArray.push(new Ball((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100, position.left, position.top, 50, 100));
  });
  getElement('bt-stop').addEventListener('click', (e) => {
    clearInterval(GLOBAL.intervalEngine);
    GLOBAL.ballArray.forEach((item) => { item.velocityX = 0; item.velocityY = 0 });
  });
  getElement('bt-clear').addEventListener('click', (e) => {
    clearInterval(GLOBAL.intervalEngine);
    GLOBAL.ballArray = [];
    GLOBAL.ballNum = 0;
    wrapper.innerHTML = '';
  });
};
