let players = {};

function init(socket, io) {
    players[socket.id] = {
        id: socket.id,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        building: false
    };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('playerMovement', (movementData) => {
        players[socket.id].position = movementData.position;
        players[socket.id].rotation = movementData.rotation;
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });

    socket.on('build', (buildData) => {
        io.emit('build', buildData);
    });

    socket.on('shoot', (shootData) => {
        io.emit('shoot', shootData);
    });
}

function disconnect(socket, io) {
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
}

module.exports = { init, disconnect };
