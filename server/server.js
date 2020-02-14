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
    socket.on('join', ({ username, room }, callback) => {
        console.log('New user connected: ' + socket.id)
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        //broadcast.emit will broadcast to other clients, except the client sending it.
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();

        //io.to.emit --> Emits an event to everybody in a specific room
        //socket.broadcast.to.emit --> Emits an event to everybody in a specific room, except for the specific client.
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    });

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter();
        if (filter.isProfane(msg.text)) {
            return callback('Profanity is not allowed!');
        }
        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.username, msg.text));
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        console.log(coords);
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, coords.latitude, coords.longitude));
        callback();
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});