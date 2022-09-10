const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let playerID = []
let playerCoordinates = []
let playerHealth = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', (socket) => {

    console.log('Player - ', socket.id, ' has connected')

    // Upon connection add new entries to player arrays
    playerID.push(socket.id)
    playerCoordinates.push([0,0])
    playerHealth.push(100)

    let playerIndex = playerID.length - 1
    socket.emit('connection', playerIndex, playerCoordinates)
  
    socket.on("disconnect", () => {
        console.log(socket.id, ' has disconnected')

        // Determine players current index
        let disconnectedIndex
        for (let i = 0; i < playerID.length; i++) {
            if (socket.id === playerID[i]) {
                disconnectedIndex = i
            }
        }

        // Upon player disconnection, remove player entries from arrays
        playerID.splice(disconnectedIndex, 1)
        playerCoordinates.splice(disconnectedIndex, 1)
        playerHealth.splice(disconnectedIndex, 1)
    });

    // PLAYER MOVEMENT
    socket.on('player-move', (axis, speed) => {

        // Determine players current index
        let playerIndex
        for (let i = 0; i < playerID.length; i++) 
        {
            if (socket.id === playerID[i]) 
            {
                playerIndex = i
            }
        }

        // Modify player coordinates
        if (axis === 'y') 
        {
            playerCoordinates[playerIndex][1] += speed
        } 
        
        else if (axis === 'x') 
        {
            playerCoordinates[playerIndex][0] += speed
        }

        // Return new coordinates back to the client side
        socket.emit('player-update-coordinates', playerIndex, playerCoordinates[playerIndex])
    })

    socket.on("update", (allPlayerObjects) => {
        let playerIndex
        for (let i = 0; i < playerID.length; i++) 
        {
            if (socket.id === playerID[i]) 
            {
                playerIndex = i
            }
        }

        // Return new coordinates back to the client side
        socket.emit('update', allPlayerObjects)
    });

});
  

server.listen(3003, () => {
  console.log('listening on *:3003');
});