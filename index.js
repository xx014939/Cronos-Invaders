// Hide/show relevant elements when starting the game
const startScreen = document.getElementById('startScreen')
const userHealth = document.querySelector('.health-bar')
const userScore = document.querySelector('.score-container')
const logo = document.querySelector('.start-scren-logo')

const backButton = document.querySelector('.back-button')

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none'
    logo.style.display = 'none'
    userHealth.style.display = 'block'
    userScore.style.display = 'flex'
    gameStarted = true
})

backButton.addEventListener('click', () => {
  startScreen.style.display = 'flex'
  logo.style.display = 'block'
  userHealth.style.display = 'none'
  userScore.style.display = 'none'
  myGameArea.stop();
  document.querySelector('canvas').style.display = 'none'
  gameStarted = false
})

// Retrieve stat upgrade from backend server

function getCookieValue (cookieName) {
  let cookieValue = document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${cookieName}=`))
  ?.split('=')[1];

  return cookieValue
}

async function getStats () {
  let walletAddress = getCookieValue('userAddress')
  let bodyContent = JSON.stringify({wallet_address: `${walletAddress}`})
  let response = await fetch('https://secure-forest-38431.herokuapp.com/wallet',  
  {method: "POST",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: bodyContent
  })

  let jsonResponse = await response.json()
  document.cookie = `statUpgrade=${jsonResponse.stat_upgrade}`
  return jsonResponse.stat_upgrade
}

// let tournament = false
// let tournamentButton = document.getElementById('tournamentButton')
// function tournamentPass(boolean) {
//   tournament = boolean
//   if (tournament) {
//     tournamentButton.href = '/multiplayer'
//     tournamentButton.classList.remove('inactive')
//   } else {
//     tournamentButton.href = '#'
//     tournamentButton.classList.add('inactive')
//   }
// }

// tournamentButton(false)
getStats()


// Increments by 0.1 every 100 after level 4
// Probability of the enemy effect happening. 
let coinFlip = 0.5;

// Decides between lower weaker effect and stronger effect.
// Increments by 0.1 every 200
let powerProbability = 0.5;

// 1, 1.5, 2
let enemySpeed = 1;
let spawnRate = 120;

function EnemyPowerUp()
{
  // Speed flag
  if (Math.random() < coinFlip)
  {
    if (Math.random() < powerProbability)
    {
      enemySpeed = 2;
    }

    else
    {
      enemySpeed = 1.5;
    }
  }

  else
  {
    enemySpeed = 1;
  }

  // Speed flag
  if (Math.random() < coinFlip)
  {
    if (Math.random() < powerProbability)
    {
      enemySpeed = 2;
    }

    else
    {
      enemySpeed = 1.5;
    }
  }

  else
  {
    enemySpeed = 1;
  }

  // Increment the probability of an effect happenening or what effect will take place.
  if (coinFlip <= 1 && powerProbability <= 1)
  {
    if (Math.random() < 0.5)
    {
      coinFlip += 0.1;
    }

    else
    {
      powerProbability += 0.1;
    }
  }

  else if (coinFlip >= 1)
  {
    powerProbability += 0.1;
  }

  else
  {
    coinFlip += 0.1;
  }

  console.log("1: " + coinFlip);
  console.log("2: " + powerProbability);
}

// Spawn rate

// Fire rate
let canFire = true;
let enemyShift = false;
let enemyFire = false;

let level = 1;

let objectType = ["Player", "Background", "E1", "E2", "E3"]

// Object & Position arrays
let bulletArray = []
let enemyArray = []
let enemyHitArray = []


//var audio = new Audio('./assets/fire.mp3');

let playerPosition = [10, 120]

let gameStarted = false

let canvasWidth = 800
let canvasHeight = 800

let currentFrame = 0

// Health Bar
let hitPoints = 10000
let currentHealthBarWidth = 500 // Pixels
const healthBar = document.querySelector('.health-bar')

// Score
let currentScore = 0
let lastScore = 0;
const scoreElement = document.getElementById('score')

// Create Enemy Attack 
function launchEnemies () 
{
  //let rowNumber = Math.floor(Math.random() * 3) + 1 // Will be used to determine the size of enemy horde

  let EnemyID = Math.floor(Math.random() * 4) + 2;
  let image;

  let enemySpawnVal = (level >= 4) ? EnemyID : level;

  switch(enemySpawnVal)
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
    enemyArray.push(new component(48, 48, image, enemyX, -100, "image"));
    enemyHitArray.push(false);
    enemyX += 60;
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
  myGameArea.canvas.classList.add('canvas')
  myGameArea.canvas.style.display = 'block'
  myGameArea.start();
  myPlayer = new component(48, 48, "./assets/playerTwo.png", 310, 430, "image");
  myBackground = new component(canvasWidth, canvasHeight, "./assets/starBG.png", 0, 0, "image");
  setInterval(CheckFireRate, 500);
  setInterval(CheckShift, 750);
  setInterval(EnemyFire, 5000);
}
  
function CheckFireRate()
{
  if (!canFire)
  {
    canFire = true;
  }
}

function CheckShift()
{
  if (!enemyShift)
  {
    enemyShift = true;
  }
}

function EnemyFire()
{
  if (!enemyFire)
  {
    enemyFire = true;
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
  function component(width, height, color, x, y, dispType) 
  {
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
    this.update = function()
    {
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
    if (gameStarted) 
    {
        currentFrame++

        // 120
        if (currentFrame % spawnRate === 0) 
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
              if (bulletArray[i].crashWith(enemyArray[j]) && bulletArray[i].image.src.includes("Shot_4_003.png")) 
              {
                if (level == 4)
                {
                  if (enemyArray[j].image.src.includes("./assets/enemy.png"))
                  {
                    // Update score
                    currentScore += 5
                    scoreElement.innerHTML = currentScore
                  }
  
                  else if (enemyArray[j].image.src.includes("./assets/E_Ship_05.png"))
                  {
                    // Update score
                    currentScore += 10
                    scoreElement.innerHTML = currentScore
                  }

                  else
                  {
                    // Update score
                    currentScore += 15
                    scoreElement.innerHTML = currentScore
                  }
                }

                else
                {
                  // Update score
                  currentScore += 5
                  scoreElement.innerHTML = currentScore
                }

                enemyArray[j] = null;
                bulletArray[i] = null;

                if (currentScore - lastScore > 100)
                {
                  lastScore = currentScore;
                  
                  level++;

                  if (level == 2)
                  {
                    myBackground = new component(canvasWidth, canvasHeight, "./assets/planetBG.png", 0, 0, "image");
                  }

                  else if (level == 3)
                  {
                    myBackground = new component(canvasWidth, canvasHeight, "./assets/planetTwoBG.png", 0, 0, "image");
                  }

                  else if (level >= 4)
                  {
                    if (level == 4)
                    {
                      myBackground = new component(canvasWidth, canvasHeight, "./assets/Starry-BG.png", 0, 0, "image");
                    }
                    
                    if (spawnRate == 120)
                    {
                      spawnRate = 100;
                    }

                    else if (spawnRate == 100)
                    {
                      spawnRate = 80;
                    }

                    else
                    {
                      spawnRate = 120;
                    }

                    EnemyPowerUp();
                  }

                  if (hitPoints < 1000)
                  {
                    if (hitPoints <= 990)
                    {
                      // Update Health
                      hitPoints += 10;
                      currentHealthBarWidth += 20;
                      healthBar.style.width = (currentHealthBarWidth) + 'px';
                    }

                    else
                    {
                      // Update Health
                      hitPoints = 1000;
                      currentHealthBarWidth = 500;
                      healthBar.style.width = (currentHealthBarWidth) + 'px';
                    }
                  }

                }
              }

              // If not then check for collision
              else if (bulletArray[i].crashWith(myPlayer) && bulletArray[i].image.src.includes("EnemyBullet.png")) 
              {
                enemyArray[j] = null;
                bulletArray[i] = null;

                // Update Health
                hitPoints -= 10;
                currentHealthBarWidth -= 20;
                healthBar.style.width = (currentHealthBarWidth) + 'px';
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

          if (currentHealthBarWidth < 2) 
          { // If HP reaches zero
            document.querySelector('.game-over').style.display = 'flex'
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
          bulletArray.push(new component(8, 24, "./assets/Shot_4_003.png", playerPosition[0] + ((myPlayer.width - 8) / 2), playerPosition[1], "image"));
          canFire = false;
        }
      }

      // Clears entire canvas every frame
      myGameArea.clear();
      myBackground.newPos();
      myBackground.update();
      myPlayer.speedX = 0;
      myPlayer.speedY = 0;
      let statBuff = getCookieValue('statUpgrade')
      let negativeSpeed = (-5)
      let positiveSpeed = (5)
      if (statBuff) {
        negativeSpeed = (-5 - parseInt(statBuff))
        positiveSpeed = (5 + parseInt(statBuff))
      }

      if (myGameArea.keys && myGameArea.keys[37]) {myPlayer.speedX = (negativeSpeed); }
      if (myGameArea.keys && myGameArea.keys[39]) {myPlayer.speedX = positiveSpeed; }
      if (myGameArea.keys && myGameArea.keys[38]) {myPlayer.speedY = (negativeSpeed); }
      if (myGameArea.keys && myGameArea.keys[40]) {myPlayer.speedY = positiveSpeed; }
      myPlayer.newPos();
      myPlayer.update();

      // Update enemies
      if (enemyArray.length > 0 ) 
      {
        enemyArray = enemyArray.filter(enemy => enemy);

        let shift = (enemyShift) ? 50 * (Math.random() < 0.5 ? -1 : 1) : 0;
      
        for (let i = 0; i < enemyArray.length; i++) 
        {
          // If the enemy has not been destroyed
          if (enemyArray[i] !== null) 
          {
              enemyArray[i].update();

              if (enemyArray[i].image.src.includes("E_Ship_05.png"))
              {
                enemyArray[i].x += shift;
                
                if (enemyArray[i].x < 0)
                {
                  enemyArray[i].x = myGameArea.canvas.width - enemyArray[i].width;
                }
        
                else if (enemyArray[i].x > myGameArea.canvas.width - enemyArray[i].width)
                {
                  enemyArray[i].x = 0;
                }
              }

              else if (enemyArray[i].image.src.includes("P_Ship_05.png") && enemyFire)
              {
                if (Math.random() < coinFlip)
                {
                  bulletArray.push(new component(8, 29, "./assets/EnemyBullet.png", enemyArray[i].x + ((enemyArray[i].width - 8) / 2), enemyArray[i].y, "image"));
                }
              }

              enemyArray[i].y += enemySpeed;

              if (enemyArray[i].y >= canvasHeight)
              {
                // Update Health

                if (hitPoints >= 5 && currentHealthBarWidth >= 10)
                {
                  hitPoints -= 5;
                  currentHealthBarWidth -= 10;
                }

                else
                {
                  hitPoints = 0;
                  currentHealthBarWidth = 0;
                }

                healthBar.style.width = (currentHealthBarWidth) + 'px';
              }
          }
        }

        enemyArray = enemyArray.filter(enemy => enemy.y < canvasHeight);

        if (enemyShift)
        {
          enemyShift = false;
        }

        if (enemyFire)
        {
          enemyFire = false;
        }
      }   

      // Update bullets
      for (i = 0; i < bulletArray.length; i += 1) 
      {
        if (bulletArray[i] !== null) 
        {
          if (bulletArray[i].image.src.includes("Shot_4_003.png"))
          {
            // If the bullet has not been destroyed
            bulletArray[i].update();
            bulletArray[i].y -= 3 
          }
          
          else
          {
            // If the bullet has not been destroyed
            bulletArray[i].update();
            bulletArray[i].y += 3 
          }
        }
      }
    } 
  }
