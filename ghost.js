// set some value for pacman 
class Ghost {
    constructor(x, y, width, heigth, speed, imageX, imageY, imagewidth, imageheight, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = heigth;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imagewidth = imagewidth;
        this.imageheight = imageheight;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * randomtargetForGhosts.length);
        // auto change direction
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000)
    }
    // move anywhere
    changeRandomDirection() {
        this.randomTargetIndex += parseInt(Math.random() * 4)
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    // move ghost 
    moveProcess() {
        // if pacman target 
        if (this.isInRangeOfPacman()) {
            this.target = pacman;
        } else { //not pacman target 
            this.target = randomtargetForGhosts[this.randomTargetIndex]
        }
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollision()) {
            this.moveBackwards()
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

    // Ghost range of pacman to target
    isInRangeOfPacman() {
        let xDirtance = Math.abs(pacman.getmapX() - this.getmapX())
        let yDirtance = Math.abs(pacman.getmapY() - this.getmapY());
        if (Math.sqrt(xDirtance * xDirtance + yDirtance * yDirtance) <= this.range) {
            return true;
        }
        return false
    }

    // changeDirection
    changeDirectionIfPossible() {
        let tempdirection = this.direction

        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / oneblocksize),
            parseInt(this.target.y / oneblocksize)
        )

        if (typeof this.direction == "undefined") {
            this.direction = tempdirection
            return
        }
        this.moveForwards();
        if (this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempdirection
        } else {
            this.moveBackwards();
        }
    }
    // auto change direction
    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }
        let queue = [{
            x: this.getmapX(),
            y: this.getmapY(),
            moves: [],
        }];

        while (queue.length > 0) {
            let poped = queue.shift()
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0]
            } else {
                mp[poped.y][poped.x] = 1
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i])
                }
            }
        }
        return DIRECTION_UP
    }
    // to help target pacman with another ghost 
    addNeighbors(poped, mp) {
        let queue = []
        let numOfRow = mp.length
        let numOfColumns = mp[0].length

        if (poped.x - 1 >= 0 && poped.x - 1 < numOfRow && mp[poped.y][poped.x - 1] != 1) {
            let tempmove = poped.moves.slice()
            tempmove.push(DIRECTION_LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempmove })
        }
        if (poped.x + 1 >= 0 && poped.x + 1 < numOfRow && mp[poped.y][poped.x + 1] != 1) {
            let tempmove = poped.moves.slice()
            tempmove.push(DIRECTION_RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempmove })
        }
        if (poped.y - 1 >= 0 && poped.y - 1 < numOfColumns && mp[poped.y - 1][poped.x] != 1) {
            let tempmove = poped.moves.slice()
            tempmove.push(DIRECTION_UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempmove })
        }
        if (poped.y + 1 >= 0 && poped.y + 1 < numOfColumns && mp[poped.y + 1][poped.x] != 1) {
            let tempmove = poped.moves.slice()
            tempmove.push(DIRECTION_BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempmove })
        }
        return queue;
    }
    // changeAnimation 
    changeAnimation() {
        this.currentFrame = this.currentFrame == this.currentFrame ? 1 : this.currentFrame + 1;
    }
    // pacman rotation 
    draw() {
        canvasContext.save();
        canvasContext.drawImage(ghostFrames, this.imageX, this.imageY, this.imagewidth, this.imageheight, this.x, this.y, this.width, this.heigth)
        canvasContext.restore();
        canvasContext.beginPath();
        canvasContext.strokeStyle = "red";
        canvasContext.arc(
            this.x + oneblocksize / 2, this.y + oneblocksize / 2, this.range * (oneblocksize - 5), 0, 2 * Math.PI
        )
        canvasContext.stroke();
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