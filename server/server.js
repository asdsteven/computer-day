const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const multiplayer = require('./multiplayer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    serveClient: false
});

app.use(express.static(path.join(__dirname, '../client')));

app.get('/:room', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

io.on('connection', socket => {
    multiplayer.onConnection(io, socket);
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
