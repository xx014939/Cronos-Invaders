const express = require('express');
const app = express();
const http = require('http');
const { emit } = require('process');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let playerIdArray = []
let playerObjects = [] // 2D Array - First dimension is player index, second dimension is player coordinates 
let playerBullets = [] // 3D Array - First dimension is player index, second dimension is an array of player bullets, third dimension is each bullets x,y coordinates - [playerIndex][bulletIndex][x/y]

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/client.html');
});


app.get('/Ship1Player1', (req, res) => {
    res.sendFile(__dirname + '/client/Ship1Player1.png');
});

app.get('/Ship1Player2', (req, res) => {
    res.sendFile(__dirname + '/client/Ship1Player2.png');
});

app.get('/Ship2Player1', (req, res) => {
    res.sendFile(__dirname + '/client/Ship2Player1.png');
});

app.get('/Ship2Player2', (req, res) => {
    res.sendFile(__dirname + '/client/Ship2Player2.png');
});

app.get('/PlayerBullet', (req, res) => {
    res.sendFile(__dirname + '/client/PlayerBullet.png');
});

app.get('/PlayerBullet2', (req, res) => {
    res.sendFile(__dirname + '/client/PlayerBullet2.png');
});

app.get('/EnemyBullet', (req, res) => {
    res.sendFile(__dirname + '/client/EnemyBullet.png');
});

app.get('/EnemyBullet2', (req, res) => {
    res.sendFile(__dirname + '/client/EnemyBullet2.png');
});


io.on('connect', (socket) => {
    console.log('Player - ', socket.id, ' has connected');

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

    socket.on('new-player-clientside', () => {

        playerIdArray.push(socket.id)
        playerBullets.push([]) // Add a new player (1st dimension)

        // Locate player index
        for (let i = 0; i < playerIdArray.length; i++) {
            if (socket.id === playerIdArray[i]) {
                if (i === 0) {
                    playerObjects.push([200,700]) // Push new starting coordinates for player one
                } else {
                    playerObjects.push([200,0]) // Push new starting coordinates for player two   
                }
            }
        }
        socket.broadcast.emit('new-player-serverside')
    })

    // Retrieve all current players + their coordinates
    socket.on('all-current-players', () => {
        socket.emit('all-current-players', playerObjects, (playerObjects.length -1), playerBullets) // Player objects array + users index. This only gets called upon connection, so we know that the last element is the current user
    })

    // Player Movement
    socket.on('player-move', (axis, speed) => {

        let playerIndex
        
        // Locate player index
        for (let i = 0; i < playerIdArray.length; i++) {
            if (socket.id === playerIdArray[i]) {

                playerIndex = i // save index

                if (axis === 'y') 
                {
                    playerObjects[i][1] += speed
                } 
                
                else if (axis === 'x') 
                {
                    playerObjects[i][0] += speed
                }
            }
        }

        // Return new coordinates back to the client side
        socket.emit('player-update-coordinates', playerIndex, playerObjects[playerIndex])
        socket.broadcast.emit('enemy-update-coordinates', playerIndex, playerObjects[playerIndex])
    })

    socket.on('shoot', () => {
        
        let playerIndex
        // Locate player index
        for (let i = 0; i < playerIdArray.length; i++) {
            if (socket.id === playerIdArray[i]) {
                playerIndex = i // save index
                let currentCoordinates = [playerObjects[playerIndex][0] + ((30 - 10) / 2), playerObjects[playerIndex][1] + ((30 - 10) / 2)] // Starting coordinates - [x,y]
                
                // Update 3D array to contain a new bullet (second dimension) and starting coordinates (third dimension)
                if (playerBullets[playerIndex]) {
                    let lastIndex = playerBullets[playerIndex].length
                    playerBullets[playerIndex][lastIndex] = (currentCoordinates)
                } else {
                    playerBullets[playerIndex] = []
                    playerBullets[playerIndex].push(currentCoordinates)
                }
                
                if (playerIndex === 0 ) {
                    //socket.emit('test', playerBullets, true)
                } else {
                    //socket.emit('test', playerBullets, false)
                }
                socket.emit('shoot', playerBullets, playerIndex)
                socket.broadcast.emit('enemy-shoot', playerBullets, playerIndex)
            }
            console.log(playerBullets)
        }
    })

    socket.on('disconnect', () => {
        for (let i = 0; i < playerIdArray.length; i++) {
            if (playerIdArray[i] === socket.id) {
                playerIdArray.splice(i, 1)
                playerObjects.splice(i, 1)
                playerBullets.splice(i, 1)
                console.log('Disconnected')
            }
        }
    })
});

server.listen(3003, () => {
    console.log('listening on *:3003');
  });