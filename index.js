// Hide start screen onclick
const startScreen = document.getElementById('startScreen')
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none'
    gameStarted = true
})

let canFire = true

let level = 1;

let objectType = ["Player", "Background", "E1", "E2", "E3"]

// Object & Position arrays
let bulletArray = []
let enemyArray = []
let enemyHitArray = []

let playerPosition = [10, 120]

let gameStarted = false

let canvasWidth = 800
let canvasHeight = 800

let currentFrame = 0

// Health Bar
let hitPoints = 1000
let currentHealthBarWidth = 500 // Pixels
const healthBar = document.querySelector('.health-bar')

// Score
let currentScore = 0
const scoreElement = document.getElementById('score')

// Create Enemy Attack 
function launchEnemies () 
{
  //let rowNumber = Math.floor(Math.random() * 3) + 1 // Will be used to determine the size of enemy horde

  let EnemyID = Math.floor(Math.random() * 4) + 2;
  let image;

  switch(level)
  {
    case (1):
      image = "./assets/enemy.png";
      break;
    case (2):
      image = "./assets/E_Ship_05.png";
      break;
    case (3):
      image = "./assets/P_Ship_05.png";
      break;
    default:
      image = "./assets/enemy.png";
      break;
  }

  let randomNumber = Math.floor(Math.random() * 10) + 1 // Will be used to determine the size of enemy horde
  let enemyX = 100

  for (let i = 0; i < randomNumber; i++) 
  {
    enemyArray.push(new component(50, 50, image, enemyX, -100, "image"))
    enemyHitArray.push(false)
    enemyX += 60
  }

  /*
  for (let row = 0; row < rowNumber; row++)
  {

  }
  */

  //console.log(randomNumber)
  //console.log(enemyArray)
}

function startGame() 
{
  myGameArea.start();
  myPlayer = new component(100, 100, "./assets/playerTwo.png", 310, 430, "image");
  myBackground = new component(canvasWidth, canvasHeight, "./assets/starBG.png", 0, 0, "image");
  setInterval(CheckFireRate, 250);
}
  
function CheckFireRate()
{
  if (!canFire)
  {
    canFire = true;
  }
}

  // Canvas Constructor 
  let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
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
  function component(width, height, color, x, y, dispType) {
    //this.type = type;
    this.dispType = dispType;
    if (dispType == "image") 
    {
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
      if (dispType == "image") 
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

        if (this.x < -(this.width / 2))
        {
          this.x = myGameArea.canvas.width - (this.width / 2);
        }

        else if (this.x > myGameArea.canvas.width - (this.width / 2))
        {
          this.x = -(this.width / 2);
        }

        if (this.y < -(this.height / 2))
        {
          this.y = myGameArea.canvas.height - (this.height / 2);
        }

        else if (this.y > myGameArea.canvas.height - (this.height / 2))
        {
          this.y = 0;
        }

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
    if (gameStarted) {

        currentFrame++

        // 120
        if (currentFrame % 120 === 0) 
        {
            launchEnemies()
        }

        // Collisions between bullet and enemies (comparing every element in each array)
        for (let i = 0; i < bulletArray.length; i++) 
        {
          for (let j = 0; j < enemyArray.length; j++) 
          {
            // Check if enemy and bullet have already been destroyed
            if (bulletArray[i] !== null && enemyArray[j] !== null) 
            {
              // If not then check for collision
              if (bulletArray[i].crashWith(enemyArray[j])) 
              {
                enemyArray[j] = null
                bulletArray[i] = null
         
                // Update score
                currentScore += 5
                scoreElement.innerHTML = currentScore

                if ((currentScore % 100 == 0) && (level < 3))
                {
                  level++;
                }
              } 
            }
          }
      }

      // Collision between player and enemies
      for (let k = 0; k < enemyArray.length; k++) {
        if (enemyArray[k] !== null && myPlayer.crashWith(enemyArray[k])) {

          // Update Health
          hitPoints = hitPoints - 1
          currentHealthBarWidth = currentHealthBarWidth - 2
          healthBar.style.width = (currentHealthBarWidth) + 'px'

          if (currentHealthBarWidth < 2) { // If HP reaches zero
            alert('GAME OVER')
            myGameArea.stop()
          }
        }
      }

      /*
      document.body.onkeydown = function(e) 
      {
          if (e.code == "Space") 
          {
            if (canFire)
            {
              bulletArray.push(new component(8, 29, "./assets/Shot_4_003.png", playerPosition[0] + ((myPlayer.width - 8) / 2), playerPosition[1], "image"));
              canFire = false;
            }
          }
      }
      */

      // Movement 
      if (myGameArea.keys && myGameArea.keys[32]) 
      {
        if (canFire)
        {
          bulletArray.push(new component(8, 29, "./assets/Shot_4_003.png", playerPosition[0] + ((myPlayer.width - 8) / 2), playerPosition[1], "image"));
          canFire = false;
        }
      }

      myGameArea.clear(); // Clears entire canvas every frame
      myBackground.newPos();
      myBackground.update();
      myPlayer.speedX = 0;
      myPlayer.speedY = 0;
          
      if (myGameArea.keys && myGameArea.keys[37]) {myPlayer.speedX = -5; }
      if (myGameArea.keys && myGameArea.keys[39]) {myPlayer.speedX = 5; }
      if (myGameArea.keys && myGameArea.keys[38]) {myPlayer.speedY = -5; }
      if (myGameArea.keys && myGameArea.keys[40]) {myPlayer.speedY = 5; }
      myPlayer.newPos();
      myPlayer.update();

      // Update enemies
      if (enemyArray.length > 0 ) 
      {
        shift = 60 * (Math.random() < 0.5 ? -1 : 1);
        
        
        
        for (let i = 0; i < enemyArray.length; i++) 
        {
          // If the enemy has not been destroyed
          if (enemyArray[i] !== null) 
          {
              enemyArray[i].update();

              if (enemyArray[i].image.src.includes("E_Ship_05.png"))
              {
                enemyArray[i].x += shift;
              }

              enemyArray[i].y += 3;
          }
        }
      }   

      // Update bullets
      for (i = 0; i < bulletArray.length; i += 1) {
        if (bulletArray[i] !== null) { // If the bullet has not been destroyed
          bulletArray[i].update();
          bulletArray[i].y -= 3 
        }
      }
    } 
  }
