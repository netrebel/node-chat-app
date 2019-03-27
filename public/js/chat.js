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

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFromInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

const $sendLocationButton = document.querySelector('#send-location');

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

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevent full page refresh.

    //disable form to avoid double-clicks
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', {
        from: 'User',
        text: message
    }, (error) => {
        $messageFormButton.removeAttribute('disabled'); //re-enable
        $messageFromInput.value = '';  //Clear input field
        $messageFromInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message delivered');
    });
});



$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (err) => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location shared!');
        });
    }, () => {
        alert('unable to share location');
    });
});
