let lobbies = {};

function init(socket, io) {
    socket.on('createLobby', (lobbyData) => {
        const { lobbyId, isPrivate, hostId } = lobbyData;
        lobbies[lobbyId] = {
            players: [hostId],
            isPrivate: isPrivate,
            host: hostId,
        };
        socket.join(lobbyId);
        io.to(lobbyId).emit('lobbyUpdate', lobbies[lobbyId].players);
    });

    socket.on('joinLobby', (lobbyData) => {
        const { lobbyId, playerId } = lobbyData;
        if (lobbies[lobbyId] && (!lobbies[lobbyId].isPrivate || lobbies[lobbyId].host === playerId)) {
            lobbies[lobbyId].players.push(playerId);
            socket.join(lobbyId);
            io.to(lobbyId).emit('lobbyUpdate', lobbies[lobbyId].players);
        } else {
            socket.emit('joinLobbyFailed', 'Unable to join lobby');
        }
    });

    socket.on('leaveLobby', (lobbyData) => {
        const { lobbyId, playerId } = lobbyData;
        if (lobbies[lobbyId]) {
            lobbies[lobbyId].players = lobbies[lobbyId].players.filter(id => id !== playerId);
            socket.leave(lobbyId);
            io.to(lobbyId).emit('lobbyUpdate', lobbies[lobbyId].players);
        }
    });
}

module.exports = { init };
