let accounts = {};

function init(socket, io) {
    socket.on('createAccount', (accountData) => {
        accounts[accountData.username] = accountData;
        socket.emit('accountCreated', accountData);
    });

    socket.on('login', (loginData) => {
        if (accounts[loginData.username] && accounts[loginData.username].password === loginData.password) {
            socket.emit('loginSuccess', accounts[loginData.username]);
        } else {
            socket.emit('loginFailure');
        }
    });
}

module.exports = { init };
