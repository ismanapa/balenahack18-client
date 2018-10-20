const senseLeds = require('sense-hat-led');
const senseJoystick = require('sense-joystick');

//CONFIGURATION SETTINGS
const SERVER_HOST = process.env.SERVER_HOST || '10.10.1.95';
const SERVER_PORT = process.env.SERVER_PORT || '8000';
const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);

//APPLICATION SETTINGS
const WIDTH = 8;
const HEIGHT = 8;
const BLACK_COLOR = [0, 0, 0];
const RED_COLOR = [255, 0, 0];

const ZOMBIE_ROLE = "zombie";
const SURVIVOR_ROLE = "survivor";

//PANELS
const _ = BLACK_COLOR;
const X = RED_COLOR;
const emptyMaze = [
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _,
    _, _, _, _, _, _, _, _
];

const cross = [
    X, _, _, _, _, _, _, X,
    _, X, _, _, _, _, X, _,
    _, _, X, _, _, X, _, _,
    _, _, _, X, X, _, _, _,
    _, _, _, X, X, _, _, _,
    _, _, X, _, _, X, _, _,
    _, X, _, _, _, _, X, _,
    X, _, _, _, _, _, _, X
];

//COLORS
const ZOMBIE_COLOR = [255, 0, 0];
const SURVIVOR_COLOR = [0, 255, 0];

const MY_ZOMBIE_COLOR = [190, 0, 0];
const MY_SURVIVOR_COLOR = [0, 190, 0];

let userData = {
    id: '2',
    position: {
        x: 0,
        y: 0
    },
    color: [0,0,0],
    role: ''
};

//EVENTS
socket.on('connect', () => { 
    console.log('connected new player');
});

socket.on('disconnect', () => { 
    senseLeds.setPixels(cross);
});

socket.on('start', (newUser) => {
    userData = Object.assign(userData, newUser);
    var newPanel = emptyMaze.slice(0);
    var position = positionToIdx(userData.position.x, userData.position.y);
    newPanel[position] = getColorByRole(userData.role);
    console.log('user on start', userData);
    senseLeds.setPixels(newPanel);
});

socket.on('update', (users) => {
    var newPanel = emptyMaze.slice(0);
    console.log('users received', users);
    users.map((user) => {
        var position = positionToIdx(user.position.x, user.position.y);

        var color;
        if (user.id === userData.id) {
            color = getColorByRole(user.role);
        } else {
            switch(user.role) {
                case SURVIVOR_ROLE:
                    color = SURVIVOR_COLOR;
                break;
                case ZOMBIE_ROLE:
                    color = ZOMBIE_COLOR;
                break;
            }
        }
        newPanel[position] = color;
    })

    senseLeds.setPixels(newPanel);
});

senseJoystick.getJoystick()
.then((joystick) => {
    joystick.on('press', (val) => {
       var x = 0;
       var y = 0;
        switch(val) {
           case 'up':
               x = -1;
            break;
           case 'down':
               x = 1;
            break;
           case 'left':
               y = -1;
            break;
           case 'right':
               y = 1;
            break;
       }
       socket.emit("move", {id: userData.id, move:{ x: x, y: y}})
    });
});



const start = () => {
    senseLeds.setPixels(cross);
}

start();

const positionToIdx = (x, y) => {
	if (x < 0 || x >= WIDTH) {
		throw new Error(`x is out of bounds: ${x}`);
	}
	if (y < 0 || y >= HEIGHT) {
		throw new Error(`y is out of bounds: ${y}`);
	}
	return (WIDTH * x) + y;
};

const getColorByRole = (role) => {
    switch(role) {
        case SURVIVOR_ROLE:
            return MY_SURVIVOR_COLOR;
        case ZOMBIE_ROLE:
            return MY_ZOMBIE_COLOR;
    }
}
