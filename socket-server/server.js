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

io.on('connect', (socket) => {
    console.log('Player - ', socket.id, ' has connected');

    socket.on('new-player-clientside', () => {
        playerIdArray.push(socket.id)
        playerObjects.push([0,0]) // Push new starting coordinates

        socket.broadcast.emit('new-player-serverside')
    })

    // Retrieve all current players + their coordinates
    socket.on('all-current-players', () => {
        socket.emit('all-current-players', playerObjects, (playerObjects.length -1)) // Player objects array + users index. This only gets called upon connection, so we know that the last element is the current user
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

    socket.on('update-enemy-positions', () => {
        let userIndex
        for (let i = 0; i < playerIdArray.length; i++) {
            if (socket.id === playerIdArray[i]) {
                userIndex = i
            }
        }
        // console.log(playerObjects)
        socket.emit('update-enemy-positions-two', playerObjects, userIndex)
    })
    

    socket.on('shoot', () => {

        console.log('SHOOT')
        let playerIndex
        // Locate player index
        for (let i = 0; i < playerIdArray.length; i++) {
            if (socket.id === playerIdArray[i]) {
                playerIndex = i // save index
                let currentCoordinates = [playerObjects[playerIndex][0], playerObjects[playerIndex][1]] // Starting coordinates - [x,y]
                
                // Update 3D array to contain a new bullet (second dimension) and starting coordinates (third dimension)
                if (playerBullets[playerIndex]) {
                    let lastIndex = playerBullets[playerIndex].length
                    playerBullets[playerIndex][lastIndex] = (currentCoordinates)
                } else {
                    playerBullets[playerIndex] = []
                    playerBullets[playerIndex].push(currentCoordinates)
                }
            }
            console.log(playerBullets)
            socket.emit('shoot', playerBullets, playerIndex)
            socket.broadcast.emit('enemy-shoot', playerBullets, playerIndex)
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