
const senseLeds = require('sense-hat-led');
const senseJoystick = require('sense-joystick');

//CONFIGURATION SETTINGS
const SERVER_HOST = process.env.SERVER_HOST || 'http://10.10.1.95';
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
    console.log('drawed empty maze');
}

const start = () => {
    drawEmptyMaze();
    mockOnStart();
    mockOnUpdate();
}

const mockOnStart = () => {
    var patata =  Object.assign([], ...maze);   
    var newPanel = maze.slice(0);
    console.log('start', newPanel);
    var position = positionToIdx(2, 4);
    newPanel[position] = MY_COLOR;
    console.log('count', newPanel.length);
    senseLeds.setPixels(newPanel);
}

const users = [
    {
        id: '1',
        position: {
            x: 2,
            y: 6,
        },
        color: [123,12,56],
    },
    {
        id: '2',
        position: {
            x: 0,
            y: 0,
        },
        color: [0,0,0],
    },
    {
        id: '3',
        position: {
            x: 4,
            y: 6,
        },
        color: [47,89,104],
    },
];

const mockOnUpdate = () => {
    var newPanel = maze.slice(0);
    
    users.map((user) => {
        console.log('user', user);
        var position = positionToIdx(user.position.x, user.position.y);
        console.log('position', position);
        var color = user.id !== userData.id ? user.color : MY_COLOR;
        console.log('update');
        newPanel[position] = color;
        console.log('count', newPanel.length);
    })

    senseLeds.setPixels(newPanel);
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
    senseLeds.setPixels(newPanel);
});

socket.on('update', (users) => {
    var newPanel = maze.slice(0);
    users.map((user) => {
        var position = positionToIdx(user.position.x, user.position.y);
        var color = user.id !== userData.id ? user.color :  MY_COLOR;
        newPanel[position] = color;
    })

    senseLeds.setPixels(newPanel);
});


start();

