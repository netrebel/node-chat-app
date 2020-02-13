var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFromInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

//Options (from chat.html qs.min.js Query String library)
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', (message) => {
    console.log('message', message);

    //use the same key property as used in the template in the html ({{message}})
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        user: message.from,
        createdAt: moment(message.createdAt).format('h:mm:ss a') //momentjs is already loaded in index.html
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
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

socket.emit('join', { username, room } );