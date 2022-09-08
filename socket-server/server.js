const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let playerID = []
let playerObject = []


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/multiplayer.html');
});

io.on('connection', (socket) => {

  socket.on('player-move', (x,y) => {
    console.log('X: ' + x, 'Y: ' + y)
  })

  socket.on('new-player', (id, newPlayerObject) => {
    playerID.push(id)
    playerObject.push(newPlayerObject)
    console.log(playerID, playerObject)
    io.emit('new-player', playerID, playerObject);
  })

  socket.on('player-move-y', (index, value) => {
    playerObject[index].speedY += (value)
    io.emit('player-move-y', index, playerObject[index].speedY)
  })

  socket.on('player-move-x', (index, value) => {
    playerObject[index].speedX += (value)
    io.emit('player-move-x', index, playerObject[index].speedX)
  })

  socket.on("disconnecting", () => {
    console.log('disconnecting'); 
    console.log(socket.id)

    for (let i = 0; i < playerID.length; i++) {
      if (playerID[i] == socket.id) {
        playerObject.splice(i,1)
        playerID.splice(i,1)
      }
    }
  });
  
  socket.on("disconnect", () => {
    console.log('disconnecting2');
    console.log(socket.id)
    for (let i = 0; i < playerID.length; i++) {
      if (playerID[i] == socket.id) {
        playerObject.splice(i,1)
        playerID.splice(i,1)
      }
    }
  });

});
  

server.listen(3003, () => {
  console.log('listening on *:3003');
});