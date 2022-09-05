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
});
  

server.listen(3003, () => {
  console.log('listening on *:3003');
});