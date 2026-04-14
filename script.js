// script.js
const player = document.getElementById("player")
const bot = document.getElementById("bot")
const ball = document.getElementById("ball")
const scoreDiv = document.getElementById("score")

var score = 0

// Tick rates
var ballInt = setInterval(moveBall, 40)
var botInt = setInterval(moveBot, 50)

// Player Movement
function move(event) {
    var key = event.key
    var x = parseInt(getComputedStyle(player).left)

    if ((key == "a" || key == "ArrowLeft") && x >= 10) {
        x -= 10
    }

    if ((key == "d" || key == "ArrowRight") && x <= 640) {
        x += 10
    }

    player.style.left = x + "px"
}

document.addEventListener('keydown', move)

// Bot Movement
function moveBot() {
    var ballX = parseInt(getComputedStyle(ball).left)
    var botX = parseInt(getComputedStyle(bot).left)

    // Bot follows Ball at set speed
    if (ballX + 5 < botX + 45 && botX > 5) {
        bot.style.left = botX - 5 + "px"
    } else if (ballX + 5 > botX + 55 && botX < 645) {
        bot.style.left = botX + 5 +  "px"
    }
}

// Reset Game State and update score
function reset() {
    player.style = null
    bot.style = null
    ball.style = null
    angle = -Math.PI / 2
    scoreDiv.innerText = "Score: " + score
}

// Checks for collision between ball and paddle
function isCollision(paddle) {
    var ballL = parseInt(getComputedStyle(ball).left)
    var ballR = ballL + 10
    var ballT = parseInt(getComputedStyle(ball).top)
    var ballB = ballT + 10

    var paddleL = parseInt(getComputedStyle(paddle).left)
    var paddleR = paddleL + 100
    var paddleT = parseInt(getComputedStyle(paddle).top)
    var paddleB = paddleT + 10
    
    return true ? (ballL <= paddleR && ballR >= paddleL && ballT <= paddleB && ballB >= paddleT) : false
}

// Returns angle for collision
function doCollision(paddle) {
    var ballL = parseInt(getComputedStyle(ball).left)
    var paddleL = parseInt(getComputedStyle(paddle).left)

    // Return angle from Pi / 6 to 5 * Pi / 6
    return (((ballL - paddleL + 10) / 110) * (-2 * Math.PI / 3)) + (5 * Math.PI / 6)
}

// Default ball speed and angle
var angle = -Math.PI / 2
var speed = 10

// Ball Movement
function moveBall() {
    var ballX = parseInt(getComputedStyle(ball).left)
    var ballY = parseInt(getComputedStyle(ball).top)

    // Collision with sides
    if (ballX <= 5 || ballX >= 735) {
        angle = Math.PI - angle
    }

    // Ball reaches either top or bottom
    if (ballY <= 0) {
        // Goal
        ++score
        reset()
        return;
    }

    if (ballY >= 490) {
        // Game Over
        score = 0
        reset()
        return;
    }

    // Collision with paddles
    if (isCollision(player)) {
        angle = doCollision(player)
    }

    if (isCollision(bot)) {
        angle = -doCollision(bot)
    }

    // Updating ball position
    var x = Math.round(speed * Math.cos(angle))
    var y = - Math.round(speed * Math.sin(angle))

    ball.style.left = ballX + x + "px"
    ball.style.top = ballY + y + "px"
}
