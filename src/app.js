
const SERVER_HOST = process.env.SERVER_HOST || 'http://10.10.1.95';
const SERVER_PORT = process.env.SERVER_PORT || '8000';
const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);

const MY_COLOR = process.env.MY_COLOR || [255, 255, 255];

let userData = {
    id: '',
    position: {
        x: 0,
        y: 0
    },
    color: '',
};

socket.on('connect', () => { 
    console.log('connected new player')
});


socket.on('start', function(newUser){
    userData = Object.assign(userData, newUser);
});
