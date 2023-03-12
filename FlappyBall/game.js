const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png';

// Game constants
const FLAP_SPEED = -5;
const Flappy_width = 40;
const Flappy_height = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// Score and highscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// We add a bool variable, to check when flappy passes, we increase the value
let scored = false;

// Let's us control with the space key
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

// Let's us restart the game
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})



function increaseScore() {
    // Increase counter when flappy passes the pipes
    if(birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
          birdY + Flappy_height > pipeY + PIPE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // Reset flag, if flappy passes the pipes
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Create bounding Boxes for flappy and pipes

    const birdBox = {
        x: birdX,
        y: birdY,
        width: Flappy_width,
        height: Flappy_height
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + Flappy_height,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + Flappy_height,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Check for collision with upper pipe box
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    // Check for collision with lower pipe box
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }

    // Check if bird hits boundaries
    if (birdY < 0 || birdY + Flappy_height > canvas.height) {
        return true;
    }


    return false;
}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;

    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// Reset the values to the beginning 
function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Flappy 
    ctx.drawImage(flappyImg, birdX, birdY);

    // Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    if (collisionCheck()) {
        endGame();
        return;
    }

    pipeX -= 1.5;
    // If pipe moves out of frame reset the pipe
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    // Apply gravity to flappy and let it move
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore()
    requestAnimationFrame(loop);
}

loop();