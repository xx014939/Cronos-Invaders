// Hide start button onclick
const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {startButton.style.display = 'none'})

function startGame() {
    myGameArea.start();
    myGamePiece = new component(100, 100, "./assets/player.png", 10, 120, "image");
    myObstacle = new component(50, 50, "./assets/bomb.png", 300, 120, "image");
  }
  
  // Canvas Constructor 
  let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = 800;
      this.canvas.height = 800;
      this.canvas.style.border = '1px solid black'
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.interval = setInterval(updateGameArea, 20); // Frame rate
      window.addEventListener('keydown', function (e) {
        myGameArea.keys = (myGameArea.keys || []);
        myGameArea.keys[e.keyCode] = true;
      })
      window.addEventListener('keyup', function (e) {
        myGameArea.keys[e.keyCode] = false;
      })
    },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
      }
  }
  
  // Player
  function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.update = function(){
      ctx = myGameArea.context;
      if (type == "image") {
        ctx.drawImage(this.image,
          this.x,
          this.y,
          this.width, this.height);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
      }
      this.crashWith = function(otherobj) {
        // Define current coordinates of obstacle
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = true; // Default
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false; // If player object is not in contact with obstacle set to false
        } 
        return crash;
      }
  }
  

  function updateGameArea() {
    if (myGamePiece.crashWith(myObstacle)) {
        myObstacle.image.src = "./assets/explosion.png";
    } 

    myGameArea.clear();
    myObstacle.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    
    // Movement 
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -5; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 5; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -5; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 5; }
    myGamePiece.newPos();
    myGamePiece.update();
      
  }
