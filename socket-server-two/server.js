const express = require('express');
const app = express();
const http = require('http');
const { emit } = require('process');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let playerID = [];
let playerCoordinates = [];
let playerHealth = [];
let sockets = [];

let bulletArray = [];
let secondBulletArray = []

let playerWidth = 30;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/Ship1Player1', (req, res) => {
    res.sendFile(__dirname + '/Ship1Player1.png');
});

app.get('/Ship1Player2', (req, res) => {
    res.sendFile(__dirname + '/Ship1Player2.png');
});

app.get('/Ship2Player1', (req, res) => {
    res.sendFile(__dirname + '/Ship2Player1.png');
});

app.get('/Ship2Player2', (req, res) => {
    res.sendFile(__dirname + '/Ship2Player2.png');
});

app.get('/playerBulletImage', (req, res) => {
    res.sendFile(__dirname + '/Shot_4_003.png');
});

app.get('/EnemyBullet', (req, res) => {
    res.sendFile(__dirname + '/EnemyBullet.png');
});

io.on('connect', (socket) => {
    console.log('Player - ', socket.id, ' has connected');

    if (!playerID.includes(socket.id))
    {
        sockets.push(socket);
    }

    // Upon connection add new entries to player arrays
    playerID.push(socket.id);
    playerHealth.push(100);
    bulletArray.push([]);

    if (playerID.length == 1)
    {
        playerCoordinates.push([400, 770]);
    }

    else
    {
        playerCoordinates.push([400, 0]);
    }

    let playerIndex = playerID.length - 1;
    socket.emit('connection', playerIndex, playerCoordinates)

    socket.on("disconnect", () => {
        console.log(socket.id, ' has disconnected')

        // Determine players current index
        let disconnectedIndex
        for (let i = 0; i < playerID.length; i++) 
        {
            if (socket.id === playerID[i]) 
            {
                disconnectedIndex = i;
            }
            else
            {
                sockets[i].emit('disconnection', disconnectedIndex)
            }
        }

        // Upon player disconnection, remove player entries from arrays
        playerID.splice(disconnectedIndex, 1);
        playerCoordinates.splice(disconnectedIndex, 1);
        playerHealth.splice(disconnectedIndex, 1);
        sockets.splice(disconnectedIndex, 1);
        bulletArray.splice(disconnectedIndex, 1);
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

    socket.on("update", () => {
        // Determine players current index
        let playerIndex
        for (let i = 0; i < playerID.length; i++) 
        {
            if (socket.id === playerID[i]) 
            {
                playerIndex = i;
            }
        }
        socket.emit('update', playerIndex, playerCoordinates, bulletArray)
    });

    socket.on('updateBullet', () => {
        // Determine players current index
        // let playerIndex
        /*
        for (let i = 0; i < bulletArray.length; i++) 
        {
            for (let j = 0; j < bulletArray[i].length; i++)
            {
                bulletArray[i][j][1] -= 2;
            }
        }
        */
        
        for (let i = 0; i < playerID.length; i++)
        {
            if (socket.id === playerID[i]) 
            {
                playerIndex = i;
            }
        }
        
        for (let i = 0; i < bulletArray[playerIndex].length; i++)
        {
            if (playerIndex % 2 == 0)
            {
                bulletArray[playerIndex][i][1] -= 2;
            }

            else
            {
                bulletArray[playerIndex][i][1] += 2;
            }
        }

        socket.emit('shoot', playerIndex, bulletArray);
    });

    socket.on('shoot', () => {
        // Determine players current index
        // let playerIndex
        for (let i = 0; i < playerID.length; i++) 
        {
            if (socket.id === playerID[i]) 
            {
                playerIndex = i;
            }
        }

        //bulletArray[playerIndex][bulletArray[playerIndex].length] = ([playerCoordinates[playerIndex][0] + ((playerWidth - 8) / 2), playerCoordinates[playerIndex][1]]);
        bulletArray[playerIndex].push([playerCoordinates[playerIndex][0] + ((playerWidth - 8) / 2), playerCoordinates[playerIndex][1]]);
        
        /*
        //
        for (let i = 0; i < playerID.length; i++) 
        {
            // ADD TO NEW BULLET TO ALL INSTANCES.
            sockets[i].emit('shoot', playerIndex, bulletArray);
        }
        */

        socket.emit('shoot', playerIndex, bulletArray);
    });

    // PLAYER MOVEMENT
});

server.listen(3003, () => {
  console.log('listening on *:3003');
});