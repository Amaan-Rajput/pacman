// they basic keywords from canvas 
const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext("2d");

// pickup Element(pacman Ghost) from document
const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghost");

// create blocks with color 
let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height)
}

// some temp values 
let fps = 30
let oneblocksize = 20; //height and  width
let wallBgColor = "#023e8a";
let wallSpaceWidth = oneblocksize / 1.5;
let wallOffset = (oneblocksize - wallSpaceWidth) / 2;
let wallinnercolor = "#000";
let Foodcolor = "#ffb703";
let score = 0;
let ghosts = [];
let ghostCount = 4
let foodCount = 0
let lives = 3

// direction values 
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

// Ghost height width with position
let ghostLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 }
]

// create map in game 
// 0 == not allow || 1 == blue wall || 2 == Foods block || 3 == null || 4 Pink block
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 1, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 2, 1, 2, 2, 1, 1, 3, 3, 3, 1, 1, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1],
    [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4],
    [1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// lets count all food in map and return value
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2) {
            foodCount++
        }
    }
}

// this help to target ramdom area in map && if pacman not near 
let randomtargetForGhosts = [
    { x: 1 * oneblocksize, y: 1 * oneblocksize },
    { x: 1 * oneblocksize, y: (map.length - 2) * oneblocksize },
    { x: (map[0].length - 2) * oneblocksize, y: oneblocksize },
    { x: (map[0].length - 2) * oneblocksize, y: (map.length - 2) * oneblocksize }
]

// they are main function
let gameloop = () => {
    draw();
    update()
}

// they are second main function
let update = () => {
    pacman.moveProcess();
    pacman.eat();
    brake()
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess()
    }
    // game Over 
    if (pacman.checkGhostCollision()) {
        restartGame();
    }
    // if score equal or greater than to food
    if (score >= foodCount) {
        drawWin();
        // remove all call function
        clearInterval(gameinterval)
    }
}

// draw Lives in board 
let drawLives = () => {
    // font and style 
    canvasContext.font = "20px Emulogic"; // Set font size and family
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives:", 270, oneblocksize * (map.length + 1));

    // check how many lives and draw 
    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneblocksize,
            0,
            oneblocksize,
            oneblocksize,
            325 + i * oneblocksize,
            oneblocksize * map.length + 5,
            oneblocksize,
            oneblocksize
        )
    }
}
// restartGame
let restartGame = () => {
    createNewPacman()
    createGhosts();
    // decrease lives
    lives--;
    // not have chance any more 
    if (lives == 0) {
        gameover()
    }
}
// complete game over 
let gameover = () => {
    drawGameOver()
    // remove all call function
    clearInterval(gameinterval)
}
// draw massage for game over 
let drawGameOver = () => {
    canvasContext.font = "900 35px Emulogic";;
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over!", 180, 275);
}

// draw massage for game win 
let drawWin = () => {
    canvasContext.font = "900 35px Emulogic";;
    canvasContext.fillStyle = "white";
    canvasContext.fillText("You Winner!", 175, 275);
}

// create food in map where is (2)  
let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(j * oneblocksize + oneblocksize / 3, i * oneblocksize + oneblocksize / 3, oneblocksize / 3, oneblocksize / 3, Foodcolor)
            }
        }
    }
}
// creat diffarent block like pink block 
let brake = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 4) {
                createRect(j * oneblocksize + 2.5, i * oneblocksize + 2.5, oneblocksize - 5, oneblocksize - 5, "#ffafcc")
            }
        }
    }
}
// create scoreboard  
let drawScore = () => {
     // font and style 
    canvasContext.font = "600 20px 'Emulogic'";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Score:" + score, 0, oneblocksize * (map.length + 1))
}
// create ghosts with lenght of ghost 
let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
}

// this function help to draw all thing in map we need in map 
let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, "#000");
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
}
// call main function in every 0.3 second 
let gameinterval = setInterval(gameloop, 1000 / fps);

// create wall in map where is (1)
let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(j * oneblocksize, i * oneblocksize, oneblocksize, oneblocksize, wallBgColor)
            }
            if (j > 0 && map[i][j - 1] == 1) {
                createRect(j * oneblocksize, i * oneblocksize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallinnercolor)
            }
            if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                createRect(j * oneblocksize + wallOffset, i * oneblocksize + wallOffset, wallSpaceWidth + wallOffset, wallSpaceWidth, wallinnercolor)
            }
            if (i > 0 && map[i - 1][j] == 1) {
                createRect(j * oneblocksize + wallOffset, i * oneblocksize, wallSpaceWidth, wallSpaceWidth + wallOffset, wallinnercolor)
            }
            if (i < map.length - 1 && map[i + 1][j] == 1) {
                createRect(j * oneblocksize + wallOffset, i * oneblocksize + wallOffset, wallSpaceWidth, wallSpaceWidth + wallOffset, wallinnercolor)
            }
        }
    }
}

// create pacman with x-y,height-width and speed 
// they import class to pacman file 
let createNewPacman = () => {
    pacman = new Pacman(
        oneblocksize,
        oneblocksize,
        oneblocksize,
        oneblocksize,
        oneblocksize / 5
    )
}

// create ghost with x-y,height-width and speed 
let createGhosts = () => {
    ghosts = []
    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            12 * oneblocksize + (i % 3 == 0 ? 0 : 1) * oneblocksize, //starting  x position 
            13 * oneblocksize + (i % 1 == 0 ? 0 : 1) * oneblocksize, // starting  Y position
            oneblocksize,
            oneblocksize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124,
            116,
            6 + i
        )
        ghosts.push(newGhost);
    }
}


createNewPacman();
createGhosts();
gameloop();

// control game with arrow keys and WASD keys 
window.addEventListener('keydown', (event) => {
    let k = event.keyCode

    setTimeout(() => {
        if (k == 37 || k == 65) {//left
            pacman.nextdirection = DIRECTION_LEFT
        } else if (k == 38 || k == 87) {//up
            pacman.nextdirection = DIRECTION_UP
        } else if (k == 39 || k == 68) {//right
            pacman.nextdirection = DIRECTION_RIGHT
        } else if (k == 40 || k == 83) {//bottom
            pacman.nextdirection = DIRECTION_BOTTOM
        }
    }, 1)
})