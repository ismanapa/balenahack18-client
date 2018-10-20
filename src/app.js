
const senseLeds = require('sense-hat-led');
const senseJoystick = require('sense-joystick');

//CONFIGURATION SETTINGS
const SERVER_HOST = process.env.SERVER_HOST || '10.10.1.95';
const SERVER_PORT = process.env.SERVER_PORT || '8000';
const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);

//APPLICATION SETTINGS
const WIDTH = 8;
const HEIGHT = 8;
const MY_COLOR = process.env.MY_COLOR || [255, 255, 255];
const BLACK_COLOR = [0, 0, 0];

let userData = {
    id: '2',
    position: {
        x: 0,
        y: 0
    },
    color: MY_COLOR,
};

const _ = BLACK_COLOR;
const maze = [
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _
];

const drawEmptyMaze = () => {
    senseLeds.setPixels(maze);
}

const start = () => {
    drawEmptyMaze();
}

const positionToIdx = (x, y) => {
	if (x < 0 || x >= WIDTH) {
		throw new Error(`x is out of bounds: ${x}`);
	}
	if (y < 0 || y >= HEIGHT) {
		throw new Error(`y is out of bounds: ${y}`);
	}
	return (WIDTH + y) * x;
};

socket.on('connect', () => { 
    console.log('connected new player');
});

socket.on('start', (newUser) => {
    userData = Object.assign(userData, newUser);
    var newPanel = maze.slice(0);
    var position = positionToIdx(userData.position.x, userData.position.y);
    newPanel[position] = MY_COLOR;
    console.log('user on start', userData);
    senseLeds.setPixels(newPanel);
});

socket.on('update', (users) => {
    var newPanel = maze.slice(0);
    console.log('users received', users);
    users.map((user) => {
        var position = positionToIdx(user.position.x, user.position.y);
        var color = user.id !== userData.id ? user.color :  MY_COLOR;
        newPanel[position] = color;
    })

    senseLeds.setPixels(newPanel);
});


start();
// Setup input callbacks
senseJoystick.getJoystick()
.then((joystick) => {
    joystick.on('press', (val) => {
       var x = 0;
       var y = 0;
       console.log('mov', val);
        switch(val) {
           case 'up':
               y = -1;
            break;
           case 'down':
               y = 1;
            break;
           case 'left':
               x = -1;
            break;
           case 'right':
               x = 1;
            break;
       }
       console.log('x', x);
       console.log('y', y);
       console.log('userData', userData);
       socket.emit("move", {id: userData.id, move:{ x: x, y: y}})
       console.log('emitimos move');
    });
});
