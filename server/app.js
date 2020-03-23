const express = require('express');
const app = express();
const http = require('http').createServer(app);
const socketio = require('socket.io');
const path = require('path');

const port = process.env.PORT || 3000;

console.log(`Server started at ${port}`);

app.use('/', express.static(path.join(__dirname, '../build')));

const server = app.listen(port);
const io = socketio().listen(server);
const game = require('./game')(io);

io.on('connection', game.newClient);

