var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');

    // socket.emit('sendMessage', {
    //     to: 'client-1@example.com',
    //     text: 'Hey, This is client-1'
    // });
});

socket.on('countUpdated', (count) => {
    console.log('The count has been updated!', count);
});

document.querySelector('#increment').addEventListener('click', () => {
    console.log('Clicked');
    socket.emit('increment');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('message', (message) => {
    console.log('message', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault(); //Prevent full page refresh.

    socket.emit('sendMessage', {
        from: 'User',
        text: e.target.elements.message.value
    }, function() {

    });
});


document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        alert('unable to share location');
    });
});
