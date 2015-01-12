var draw = function(snakeToDraw, apple) {
  var drawableSnake = { color: "green", pixels: snakeToDraw };
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableObjects = [drawableSnake, drawableApple];
  CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) { 
  switch (segment.direction) {
   
    case "down":
        return { top: segment.top + 1, left: segment.left }
    case "up":
        return { top: segment.top - 1, left: segment.left }
    case "right":
        return { top: segment.top, left: segment.left + 1 }
    case "left":
        return { top: segment.top, left: segment.left - 1 }
    default:
        return segment;
  }
}

var segmentFurtherForwardThan = function(index, snake) {
  // if (snake[index - 1] === undefined) {
  //   return snake[index];
  // } else {
  //   return snake[index - 1];
  // }
  return snake[index - 1] || snake[index];

}

var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[snake.length - 1];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}

var moveSnake = function(snake) {
  var newSnake = [];
  snake.forEach(function(oldSegment, segmentIndex){
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    newSnake.push(newSegment);
  });
  return newSnake;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

var advanceGame = function() {
  var newSnake = moveSnake(snake);
  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Woops! You ate yourself!");
  }

  if (ate(newSnake,[apple])) {
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Woops! you hit a wall!");
  }

  snake = newSnake;
  draw(snake, apple);
}

var changeDirection = function(direction) {
  snake[0].direction = direction;
}

var snake = [{ top: 0, left: 0, direction: "down" }];
var apple = { top: 8, left: 10 };

CHUNK.executeNTimesPerSecond(advanceGame, 4);
CHUNK.onArrowKey(changeDirection);


