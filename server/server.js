const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const Filter = require('bad-words');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

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

    socket.on('join', ({ username, room }, callback) => {
        console.log('add user: ' + socket.id)
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Welcome!'));
        //broadcast.emit will broadcast to other clients, except the client sending it.
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`));

        callback();

        //io.to.emit --> Emits an event to everybody in a specific room
        //socket.broadcast.to.emit --> Emits an event to everybody in a specific room, except for the specific client.
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
        }
    });

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter();
        if (filter.isProfane(msg.text)) {
            return callback('Profanity is not allowed!');
        }
        console.log('sendMessage', msg);
        io.to('Center City').emit('message', generateMessage(msg.from, msg.text));
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        console.log(coords);
        io.emit('locationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
        callback();
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});