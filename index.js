// Hide start button onclick
const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {
    startButton.style.display = 'none'
})

// Object & Position arrays
let bulletArray = []
let enemyArray = []

let playerPosition = [10, 120]

// Create Enemy Attack 
function launchEnemies () {
  let randomNumber = Math.floor(Math.random() * 10) + 1 // Will be used to determine the size of enemy horde
  let enemyX = 100

  for (let i =0; i < randomNumber; i++) {
    enemyArray.push(new component(50, 50, "red", enemyX, 320, ""))
    enemyX = enemyX + 60
  }

  console.log(randomNumber)
  console.log(enemyArray)
}

function startGame() {
    myGameArea.start();
    myPlayer = new component(100, 100, "./assets/player.png", 10, 120, "image");
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
      this.interval = setInterval(updateGameArea, 30); // Frame rate
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
  
  // Object Constructor
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
      if (type == "image") 
      {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
      else 
      {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        playerPosition[0] = this.x
        playerPosition[1] = this.y
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

        // If player object is not in contact with obstacle set to false
        let crash = !((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)); // Default
        
        return crash;
      }
  }
  

  function updateGameArea() 
  {
    if (myPlayer.crashWith(myObstacle)) {
        myObstacle.image.src = "./assets/explosion.png";
    } 

    document.body.onkeyup = function(e) {
        if (e.code == "Space") 
        {
          bulletArray.push(new component(25, 25, "./assets/bullet.png", playerPosition[0] + ((myPlayer.width - 25) / 2), playerPosition[1], "image"));
        }
      }

    myGameArea.clear();
    myObstacle.update();
    myPlayer.speedX = 0;
    myPlayer.speedY = 0;

    // Update bullets
    for (i = 0; i < bulletArray.length; i += 1) {
        bulletArray[i].update();
        bulletArray[i].y -= 3 
        if (bulletArray[i].crashWith(myObstacle)) {
            myObstacle.image.src = "./assets/explosion.png";
        } 
      }
    
    // Movement 
    if (myGameArea.keys && myGameArea.keys[37]) {myPlayer.speedX = -5; }
    if (myGameArea.keys && myGameArea.keys[39]) {myPlayer.speedX = 5; }
    if (myGameArea.keys && myGameArea.keys[38]) {myPlayer.speedY = -5; }
    if (myGameArea.keys && myGameArea.keys[40]) {myPlayer.speedY = 5; }
    myPlayer.newPos();
    myPlayer.update();

    // Update enemies
      if (enemyArray.length > 0 ) {
        for (let i = 0; i < enemyArray.length; i++) {
          enemyArray[i].update()
          enemyArray[i].y += 6
        }
      }   
  }
