// Constants
const WIDTH = 30;
const HEIGHT = 20;
const TICK_RATE = 200; // milliseconds

// Directions
const UP = 'up';
const DOWN = 'down';
const LEFT = 'left';
const RIGHT = 'right';

// Model
class SnakeGame {
    constructor() {
        this.snake = new Queue();
        this.snake.enqueue({ x: 15, y: 10 }); // Starting position
        this.food = { x: 0, y: 0 };
        this.direction = RIGHT;
        this.generateFood();
        this.intervalId = setInterval(() => this.tick(), TICK_RATE);
    }

    tick() {
        this.move();
        this.draw();
    }

    move() {
        const head = this.snake.peek();
        let newHead = { ...head }; // Copy head position

        // Move head
        switch (this.direction) {
            case UP:
                newHead.y--;
                break;
            case DOWN:
                newHead.y++;
                break;
            case LEFT:
                newHead.x--;
                break;
            case RIGHT:
                newHead.x++;
                break;
        }

        // Check if collided with self
        if (this.collidedWithSelf(newHead)) {
            clearInterval(this.intervalId);
            alert('Game Over!');
            return;
        }

        // Check if collided with wall
        if (newHead.x < 0 || newHead.x >= WIDTH || newHead.y < 0 || newHead.y >= HEIGHT) {
            // Handle collision with wall
            return;
        }

        // Check if ate food
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            // Grow snake
            this.snake.enqueue(newHead);
            this.generateFood();
        } else {
            // Move snake
            this.snake.dequeue();
            this.snake.enqueue(newHead);
        }
    }

    collidedWithSelf(head) {
        for (const segment of this.snake) {
            if (segment.x === head.x && segment.y === head.y) {
                return true;
            }
        }
        return false;
    }

    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * WIDTH),
            y: Math.floor(Math.random() * HEIGHT)
        };
    }

    draw() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';

        // Draw snake
        for (const segment of this.snake) {
            const snakeElement = document.createElement('div');
            snakeElement.classList.add('cell', 'snake');
            snakeElement.style.gridRowStart = segment.y + 1;
            snakeElement.style.gridColumnStart = segment.x + 1;
            gameBoard.appendChild(snakeElement);
        }

        // Draw food
        const foodElement = document.createElement('div');
        foodElement.classList.add('cell', 'food');
        foodElement.style.gridRowStart = this.food.y + 1;
        foodElement.style.gridColumnStart = this.food.x + 1;
        gameBoard.appendChild(foodElement);
    }

    changeDirection(newDirection) {
        if (this.isOppositeDirection(newDirection)) {
            return;
        }
        this.direction = newDirection;
    }

    isOppositeDirection(newDirection) {
        return (this.direction === UP && newDirection === DOWN) ||
            (this.direction === DOWN && newDirection === UP) ||
            (this.direction === LEFT && newDirection === RIGHT) ||
            (this.direction === RIGHT && newDirection === LEFT);
    }
}

// Queue implementation
class Queue {
    constructor() {
        this.elements = [];
    }

    enqueue(element) {
        this.elements.push(element);
    }

    dequeue() {
        return this.elements.shift();
    }

    peek() {
        return this.elements[0];
    }

    *[Symbol.iterator]() {
        for (const element of this.elements) {
            yield element;
        }
    }
}

// Controller
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'w':
            game.changeDirection(UP);
            break;
        case 's':
            game.changeDirection(DOWN);
            break;
        case 'a':
            game.changeDirection(LEFT);
            break;
        case 'd':
            game.changeDirection(RIGHT);
            break;
    }
});

// Initialize game
const game = new SnakeGame();
