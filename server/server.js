const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

let count = 0;

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        count++;
        io.emit('countUpdated', count); //Emit to all connetions
    });

    socket.emit('message', generateMessage('Admin', 'Welcome to the chat App'));

    //broadcast.emit will broadcast to other clients, except the client sending it.
    socket.broadcast.emit('message', generateMessage('Admin', 'New user joined'));

    socket.on('disconnect', () => {
        console.log('User was disconnected');

    });

    socket.on('sendMessage', (msg, callback) => {
        console.log('sendMessage', msg);
        io.emit('message', generateMessage(msg.from, msg.text));
        callback('I see you');
    });

    socket.on('sendLocation', (coords) => {
        console.log(coords);
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});