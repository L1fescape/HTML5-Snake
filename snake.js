// Helper functions
function clone(s) {
  for(p in s)
    this[p] = (typeof(s[p]) == 'object')? new clone(s[p]) : s[p];
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function prependArray(a, b) {
  var args = b;
  args.unshift(0);
  args.unshift(0);
  Array.prototype.splice.apply(a, args);
}

// Block object


var Snake = {
  canvas : {},
  ctx : {},
  score : 0,
  interval : 0,
  settings : {
    width : 0,
    height : 0,
    block : 15,
    interval : 100
  },
  canPressKey : true,
  init : function() {
    
    Snake.canvas = $('#gameBoard');
    Snake.ctx = Snake.canvas[0].getContext('2d');
    
    Snake.settings.width = $("#gameBoard").width();
    Snake.settings.height = $("#gameBoard").height();
    
    Snake.pieces = [[10,14]];

    Snake.interval = setInterval("Snake.draw()", 10);
  },
  timer : 0,
  move : function() {
    // FUCK JAVACSRIPT OBJECTS
    var newx = Snake.pieces[0][0];
    var newy = Snake.pieces[0][1];
    newx += Snake.direction[0];
    newy += Snake.direction[1];
    Snake.pieces.splice(Snake.pieces.length-1,1);
    Snake.pieces.unshift([newx, newy]);
    if (!Snake.check())
      this.gameOver();
  },
  gameOver : function() {
    clearInterval(Snake.interval);
    console.log("game over");
  },
  food : [],
  genFood : function() {
    var r = Math.floor((Math.random()*300));
    if (r < 75) {
      var x = Math.floor((Math.random()*parseInt(Snake.settings.width/Snake.settings.block))+0);
      var y = Math.floor((Math.random()*parseInt(Snake.settings.height/Snake.settings.block))+0);
      Snake.food[Snake.food.length] = [x,y];
    }
  },
  addPiece : function(food) {
    Snake.pieces[Snake.pieces.length] = [food];
    Snake.score += 10;
  },
  check : function() {
    var curPiece = Snake.pieces[0];
    var food = Snake.food;
    
    for (var p = 0; p < Snake.pieces.length; p++) {
      var piece = Snake.pieces[p];
      
      // check overlapping pieces
      if (p > 0) {
        if (piece[0] == curPiece[0] && piece[1] == curPiece[1])
	  return false;
      }
      
      //check boundaries
      if (piece[0]*15 >= Snake.settings.width)
        Snake.pieces[p][0] -= parseInt(Snake.settings.width/Snake.settings.block);
      if (piece[0]*15 < 0)
        Snake.pieces[p][0] += parseInt(Snake.settings.width/Snake.settings.block);
      if (piece[1]*15 >= Snake.settings.height)
        Snake.pieces[p][1] -= parseInt(Snake.settings.height/Snake.settings.block);
      if (piece[1]*15 < 0)
        Snake.pieces[p][1] += parseInt(Snake.settings.height/Snake.settings.block);
        
      
      // check food
      var foodLength = food.length;
      for (var f = 0; f < foodLength; f++) {
        var curFood = food[f];
        if (piece[0] == curFood[0] && piece[1] == curFood[1]) {
          Snake.addPiece(curFood);
	  food.splice(f,1);
	  f--;
	  foodLength--;
	}
      }
    }
    return true;

  }, 
  direction : [1,0],
  pieces : [],
  draw : function() {
    Snake.ctx.clearRect( 0, 0, Snake.settings.width, Snake.settings.height);

    Snake.ctx.fillStyle = "#E3CBAC";
    Snake.ctx.beginPath();
    Snake.ctx.rect(0, 0, Snake.settings.width, Snake.settings.height);
    Snake.ctx.closePath();
    Snake.ctx.fill();

    // draw snake
    for (var p = 0; p < Snake.pieces.length; p+=1) {
      var piece = Snake.pieces[p];
      var x = piece[0]*Snake.settings.block;
      var y = piece[1]*Snake.settings.block;
      Snake.ctx.fillStyle = "#324654";
      Snake.ctx.beginPath();
      Snake.ctx.rect(x, y, Snake.settings.block, Snake.settings.block);
      Snake.ctx.closePath();
      Snake.ctx.fill();
    }


    // draw food
    for (var f = 0; f < Snake.food.length; f++) {
      var food = Snake.food[f];
      var x = food[0]*Snake.settings.block;
      var y = food[1]*Snake.settings.block;
      Snake.ctx.fillStyle = "#C46D3B";
      Snake.ctx.beginPath();
      Snake.ctx.rect(x, y, Snake.settings.block, Snake.settings.block);
      Snake.ctx.closePath();
      Snake.ctx.fill();
    }

    
    if (Snake.timer == Snake.settings.interval) {
      Snake.timer = 0;
      Snake.genFood();
      Snake.move();
      Snake.canPressKey = true;
    }

    Snake.timer += 10;
    $("#score").html("<h3>Score: " + Snake.score + "</h3>");
 
  },
  keyBindings : function(key) {
    if (Snake.canPressKey) {
    switch (key) {
      case 119 :
        if (Snake.direction[1] != 1) {
          Snake.direction = [0,-1];
	  Snake.canPressKey = false;
	}
	break;
      case 115 :
        if (Snake.direction[1] != -1) {
          Snake.direction = [0,1];
	  Snake.canPressKey = false;
	}
	break;
      case 97 :
        if (Snake.direction[0] != 1) {
	  Snake.direction = [-1,0];
	  Snake.canPressKey = false;
	}
	break;
      case 100 :
        if (Snake.direction[0] != -1) {
          Snake.direction = [1,0];
	  Snake.canPressKey = false;
	}
	break;
    }
    }
  }
};

Snake.init();
$(document).keypress(function(e){Snake.keyBindings(e.which);});
