//declare variables for showing messages
const messageOnDash = document.getElementById('messageOnDash');
const messages = ["Game Over!!", "Abandon Ship!", "There Are So Many!", "Keep Firing!", "Shoot Them Down Now!!", "Kamikaze! Shoot Them!", ]
const percents = ['0%', '20%', '40%', '60%', '80%', '100%']

//declare variables that hold elements in the document
const sun = document.getElementById('sun');
const cloud1 = document.getElementById('cloud1');
const cloud2 = document.getElementById('cloud2');
const lifeBar = document.getElementById('life');
const lifePercent = document.getElementById('lifePercent');
const scoreOnDash = document.getElementById('scoreOnDash');
const nameOnDash = document.getElementById('nameOnDash');
const btnStart = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const point1 = document.getElementById('point1');
const point2 = document.getElementById('point2');
const point3 = document.getElementById('point3');
const gun1 = document.getElementById('gun1');
const gun2 = document.getElementById('gun2');
const ship = document.getElementById('ship');
const gunBase = document.getElementById('gunBase');
const shipBlock = document.getElementById('shipBlock');
const btnExit = document.getElementById('exitGame');

//declare variables that hold initial values
let lifeBarWidth = 315;
let messageNum = 5;
let gunBasePos = 450;
let gunBaseTop = 436;
let score = 0;
let playerName = '';
let onPlay = false;
let animateGame;

//add event listener to buttons
btnStart.addEventListener('click', startGame);
btnExit.addEventListener('click', refresh);

//sections for the functions that run the game
function startGame() {
  backgroundSound = setInterval(playPlaneSound, 20500);
  reset();
  if (playerName === '') {
    playerName = prompt("Welcom to 1945 OKINAWA. Let's shoot Kamikaze down!\n\nRules:\n1. Hit spacebar to shoot.\n2. Use arrow keys to move the gun right or left.\n\nPlease enter your name:", "Harry Potter");
  }
  showName();
  postScore();
  onPlay = true;
  playPlaneSound();
  setTimeout(createKamikaze, 5000);
  runGame();
}

function runGame() {
  if (onPlay) {
    showMessage(messageNum);
    document.addEventListener('keydown', pressKey);
    flyKamikaze();
    moveBullet();
    animateGame = requestAnimationFrame(runGame);
  } 
}

function gameOver() {
  onPlay = false;
  let kamikazes = document.querySelectorAll('.kamikaze');
  for (let plane of kamikazes) {
    plane.parentNode.removeChild(plane);
  }
  let bullets = document.querySelectorAll('.bullet');
  for (let shot of bullets) {
    shot.parentNode.removeChild(shot);
  }
  cancelAnimationFrame(animateGame);
  playEndSound();
  clearInterval(backgroundSound);
  btnStart.innerHTML = "Play Again";
  btnExit.style.visibility = "visible";
}

function refresh() {
  location.reload();
}

function reset() {
  lifeBarWidth = 315;
  messageNum = 5;
  gunBasePos = 450;
  score = 0;
  lifeBar.style.width = lifeBarWidth + 'px';
  lifeBar.style.backgroundColor = "lawngreen";
  btnExit.style.visibility = "hidden";
}

function postScore() {
  scoreOnDash.innerText = `${score}`;
}

function createKamikaze() {
  let newKamikaze = document.createElement('img');
  newKamikaze.setAttribute('class', 'kamikaze');
  newKamikaze.setAttribute('src', 'pics/kamikaze.png');
  let randomNum = Math.floor((Math.random() * 3) + 1);
  if (randomNum === 1) {
    point1.appendChild(newKamikaze);
  } else if (randomNum === 2) {
    point2.appendChild(newKamikaze);
  } else {
    point3.appendChild(newKamikaze);
  }
}

function flyKamikaze(kamikaze) {
  let kamikazes = document.querySelectorAll('.kamikaze');
  for (let plane of kamikazes) {
    if (plane.offsetTop > 450) {
      plane.parentNode.removeChild(plane);
      createKamikaze();
    } else if (isCollide(plane, shipBlock)) {
      reduceLife();
      if (plane.parentNode) {
        plane.parentNode.removeChild(plane);
      }
      if (onPlay) {
        createKamikaze();
      }
    } else if (plane.id === 'explosion') {
      plane.style.top = plane.offsetTop + 1 + 'px';
      plane.parentNode.removeChild(plane);
      createKamikaze();
    } else {
      plane.style.top = plane.offsetTop + 5 + 'px'; 
    }
  }
}

function moveBullet() {
  let bullets = document.querySelectorAll('.bullet');
  let kamikazes = document.querySelectorAll('.kamikaze');
  for (let shot of bullets) {
    for (let plane of kamikazes) {
      if (shot.offsetTop < 40) {
        shot.parentNode.removeChild(shot);
      } else if (isCollide(shot, plane)) {
        addScore();
        plane.setAttribute('src', 'pics/explosion.png');
        plane.setAttribute('id', 'explosion');
        shot.parentNode.removeChild(shot);
        break;
      } else {
        shot.style.top = shot.offsetTop - 4 + 'px';
      }
    }
  }
}

function removePlane(plane) {
  plane.parentNode.removeChild(plane);
}

function isCollide(element1, element2) {
  let rect1 = element1.getBoundingClientRect();
  let rect2 = element2.getBoundingClientRect();
  return !(
    (rect1.bottom < rect2.top) || (rect1.top > rect2.bottom) || (rect1.right < rect2.left) || (rect1.left > rect2.right))
}

function fireBullet(e) {
  playGunSound();
  let bullet1 = document.createElement('div');
  let bullet2 = document.createElement('div');
  bullet1.setAttribute('class', 'bullet');
  bullet2.setAttribute('class', 'bullet');
  bullet1.style.width = 8 + 'px';
  bullet1.style.height = 8 + 'px';
  bullet2.style.width = 8 + 'px';
  bullet2.style.height = 8 + 'px';
  bullet1.style.top = 423 + 'px';
  bullet2.style.top = 423 + 'px';
  bullet1.style.left = gunBase.offsetLeft + 8 + 'px';
  bullet2.style.left = gunBase.offsetLeft + 22 + 'px';
  gameArea.appendChild(bullet1);
  gameArea.appendChild(bullet2);
  moveGunBaseDown();
  setTimeout(moveGunBaseUp, 80);
}

function pressKey(event) {
  if (event.keyCode === 32 && onPlay === true) {
    event.preventDefault();
    fireBullet();
  } else if (event.keyCode === 39 && onPlay === true) {
    event.preventDefault();
    moveGunRight();
  } else if (event.keyCode === 37 && onPlay === true) {
    event.preventDefault();
    moveGunLeft();
  } else {
    event.preventDefault();
  }
}

function showName() {
  nameOnDash.innerHTML = `${name}`;
}

function addScore() {
  score += 100;
  postScore();
}

function reduceLife() {
  playExploreSound();
  hitShipBlock();
  setTimeout(shipBlockBack, 150);
  if (messageNum > 1) {
    lifeBarWidth -= 63;
    messageNum -= 1;
    lifeBar.style.width = lifeBarWidth + 'px';
    showMessage(messageNum);
  } else {
    lifeBarWidth -= 63;
    messageNum -= 1;
    lifeBar.style.width = lifeBarWidth + 'px';
    showMessage(messageNum);
    gameOver();
  }
}

function showMessage(messageNum) {
  switch (messageNum) {
    case 0:
      message = messages[0] + ` Your Score: ${score}`;
      percent = percents[0];
      break;
    case 1:
      message = messages[1];
      percent = percents[1];
      lifeBar.style.backgroundColor = "red";
      break;
    case 2:
      message = messages[2];
      percent = percents[2];
      lifeBar.style.backgroundColor = "orange";
      break;
    case 3:
      message = messages[3];
      percent = percents[3];
      lifeBar.style.backgroundColor = "gold";
      break;
    case 4:
      message = messages[4];
      percent = percents[4];
      lifeBar.style.backgroundColor = "yellowgreen";
      break;
    case 5:
      message = messages[5];
      percent = percents[5];
      lifeBar.style.backgroundColor = "lawngreen";
      break;
  }
  messageOnDash.innerHTML = `${message}&nbsp;`;
  lifePercent.innerHTML = `&nbsp;&nbsp;${percent}&nbsp;&nbsp;`;
}

function moveGunRight() {
  if (gunBasePos <= 500) {
    gunBasePos += 50;
    gunBase.style.left = gunBasePos + 'px';
  }
}

function moveGunLeft() {
  if (gunBasePos >= 400) {
    gunBasePos -= 50;
    gunBase.style.left = gunBasePos + 'px';
  }
}

function moveGunBaseDown() {
  gunBaseTop += 5;
  gunBase.style.top = gunBaseTop + 'px';
}

function moveGunBaseUp() {
  gunBaseTop -= 5;
  gunBase.style.top = gunBaseTop + 'px';
}

function hitShipBlock() {
  shipBlock.style.backgroundColor = 'red';
}

function shipBlockBack() {
  shipBlock.style.backgroundColor = 'lightblue';
}

//section for functions that play different sounds
function playGunSound() {
  let gunSound = new Audio('sounds/gun.mp3');
  gunSound.play();
}

function playExploreSound() {
  let exploreSound = new Audio('sounds/explosion.mp3');
  exploreSound.play();
}

function playPlaneSound() {
  let planeSound = new Audio('sounds/plane.mp3');
  planeSound.play();
}

function playEndSound() {
  let endSound = new Audio('sounds/theEnd.mp3');
  endSound.play();
}
