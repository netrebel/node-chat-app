const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'admin',
        text: 'Welcome to the chat app!',
        createdAt: new Date().toISOString()
    });

    //broadcast.emit will broadcast to other clients, except the client sending it.
    socket.broadcast.emit('newMessage', {
        from: 'admin',
        text: 'New user joined',
        createdAt: new Date().toISOString()
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');

    });

    socket.on('createMessage', (msg) => {
        console.log('createMessage', msg);
        io.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().toISOString()
        })
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});