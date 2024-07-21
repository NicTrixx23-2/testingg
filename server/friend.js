let friends = {};

function init(socket, io) {
    socket.on('addFriend', (friendData) => {
        if (!friends[socket.id]) {
            friends[socket.id] = [];
        }
        friends[socket.id].push(friendData.friendId);
        socket.emit('friendAdded', friendData.friendId);
    });

    socket.on('removeFriend', (friendData) => {
        if (friends[socket.id]) {
            friends[socket.id] = friends[socket.id].filter(id => id !== friendData.friendId);
            socket.emit('friendRemoved', friendData.friendId);
        }
    });

    socket.on('getFriends', () => {
        socket.emit('friendList', friends[socket.id] || []);
    });

    socket.on('inviteFriend', (inviteData) => {
        const { friendId, lobbyId } = inviteData;
        io.to(friendId).emit('invitedToLobby', { lobbyId, hostId: socket.id });
    });
}

module.exports = { init };
