// set some value for pacman 
class Pacman {
    constructor(x, y, width, heigth, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = heigth;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.nextdirection = this.direction
        this.currentFrame = 1
        this.FrameCount = 7

        // for Animation effect 
        setInterval(() => {
            this.changeAnimation();
        }, 100)
    }
    // move pacman  
    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollision()) {
            this.moveBackwards()
        }
    }
    // pacamn eat food and score increase 
    // in map 2 convart to 3 
    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] == 2 && this.getmapX() == j && this.getmapY() == i) {
                    map[i][j] = 3
                    score++;
                }
            }
        }
    }
    // check direction to move 
    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed
                break;
            case DIRECTION_UP:
                this.y += this.speed
                break;
            case DIRECTION_LEFT:
                this.x += this.speed
                break;
            case DIRECTION_BOTTOM:
                this.y -= this.speed
                break;
        }
    }
    // check direction to move
    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed
                break;
            case DIRECTION_UP:
                this.y -= this.speed
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed
                break;
            case DIRECTION_BOTTOM:
                this.y += this.speed
                break;
        }
    }
    // check not allow blocks to move
    checkCollision() {
        let isCollided = false;
        if (map[this.getmapY()][this.getmapX()] == 1 ||
            map[this.getmapYRightSide()][this.getmapX()] == 1 ||
            map[this.getmapY()][this.getmapXRightSide()] == 1 ||
            map[this.getmapYRightSide()][this.getmapXRightSide()] == 1 ||
            map[this.getmapY()][this.getmapX()] == 0 ||
            map[this.getmapYRightSide()][this.getmapX()] == 0 ||
            map[this.getmapY()][this.getmapXRightSide()] == 0 ||
            map[this.getmapYRightSide()][this.getmapXRightSide()] == 0 ||
            map[this.getmapY()][this.getmapX()] == 4 
        ) {
            return true;
        }
        return false;
    }
    // ghost catch pacman
    checkGhostCollision() {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (ghost.getmapX() == this.getmapX() && ghost.getmapY() == this.getmapY()) {
                return true;
            }
        }
        return false;
    }
    // changeDirection 
    changeDirectionIfPossible() {
        if (this.direction == this.nextdirection) return

        let tempdirection = this.direction;
        this.direction = this.nextdirection;
        this.moveForwards();
        if (this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempdirection
        } else {
            this.moveBackwards();
        }
    }
    // changeAnimation 
    changeAnimation() {
        this.currentFrame = this.currentFrame == this.FrameCount ? 1 : this.currentFrame + 1;
    }
    // pacman rotation 
    draw() {
        canvasContext.save();
        canvasContext.translate(this.x + oneblocksize / 2, this.y + oneblocksize / 2);
        canvasContext.rotate((this.direction * 90 * Math.PI) / 180)
        canvasContext.translate(
            -this.x - oneblocksize / 2,
            -this.y - oneblocksize / 2
        );

        canvasContext.drawImage(pacmanFrames, (this.currentFrame - 1) * oneblocksize, 0, oneblocksize, oneblocksize, this.x, this.y, this.width, this.heigth)
        canvasContext.restore();
    }
    getmapX() {
        return parseInt(this.x / oneblocksize)
    }
    getmapY() {
        return parseInt(this.y / oneblocksize)
    }
    getmapXRightSide() {
        return parseInt((this.x + 0.9999 * oneblocksize) / oneblocksize)
    }
    getmapYRightSide() {
        return parseInt((this.y + 0.9999 * oneblocksize) / oneblocksize)
    }
}