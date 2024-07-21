const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const game = require('./server/game');
const lobby = require('./server/lobby');
const account = require('./server/account');
const friend = require('./server/friend');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    game.init(socket, io);
    lobby.init(socket, io);
    account.init(socket, io);
    friend.init(socket, io);

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        game.disconnect(socket, io);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
