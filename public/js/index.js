var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    // socket.emit('createMessage', {
    //     to: 'client-1@example.com',
    //     text: 'Hey, This is client-1'
    // });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('newMessage', message);
});

socket.emit('createMessage', {
    from: 'Client',
    text: 'Hi'
}, function (res) {
    console.log('Got it: ' + res);
});