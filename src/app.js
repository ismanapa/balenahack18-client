
const senseLeds = require('sense-hat-led');
const senseJoystick = require('sense-joystick');

//CONFIGURATION SETTINGS
const SERVER_HOST = process.env.SERVER_HOST || 'http://10.10.1.95';
const SERVER_PORT = process.env.SERVER_PORT || '8000';
const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);

// APPLICATION SETTINGS
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

const { mazes } = (() => {
    const _ = BLACK_COLOR;
	const mazes = {
		none: [
			_, _, _, _, _, _, _, _,
			_, _, _, _, _, _, _, _,
			_, _, _, _, _, _, _, _,
			_, _, _, _, _, _, _, _,
			_, _, _, _, _, _, _, _,
			_, _, _, _, _, _, _, _,
			_, _, _, _, _, _, _, _,
			_, _, _, _, _, _, _, _
		]
	};

	return { mazes }
})();

const drawMaze = (maze) => {
    senseLeds.setPixels(maze);
}

const drawEmptyMaze = () => {
    senseLeds.setPixels(mazes.none);
}

const start = () => {
    drawEmptyMaze();
    mockOnStart();
    mockOnUpdate();
}

const mockOnStart = () => {
    var patata = mazes.none;
    var position = positionToIdx(2, 4);
    patata[position] = MY_COLOR;
    drawMaze(patata);
}

const mockOnUpdate = () => {
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

    var newPanel = Object.assign({}, mazes.none);
    users.map((user) => {
        var position = positionToIdx(user.position.x, user.position.y);
        var color = user.id !== userData.id ? user.color : MY_COLOR;
        newPanel[position] = color;
    })

    drawMaze(newPanel);

}

const positionToIdx = (x, y ) => {
	if (x < 0 || x >= WIDTH) {
		throw new Error(`x is out of bounds: ${x}`);
	}
	if (y < 0 || y >= HEIGHT) {
		throw new Error(`y is out of bounds: ${y}`);
	}
	return (x + WIDTH) * y;
};

socket.on('connect', () => { 
    console.log('connected new player');
});

socket.on('start', (newUser) => {
    userData = Object.assign(userData, newUser);
    var newPanel = Object.assign({}, mazes.none);
    var position = positionToIdx(userData.position.x, userData.position.y);
    newPanel[position] = MY_COLOR;
    drawMaze(newPanel);
});

// [
//     {
//         position: {x: , y: },
//         color: [,,],
//         id: ''
//     }
//     ...
// ]
socket.on('update', (users) => {
    var newPanel = Object.assign({}, mazes.none);
    users.map((user) => {
        var position = positionToIdx(user.position.x, user.position.y);
        var color = user.id !== userData.id ? user.color :  MY_COLOR;
        newPanel[position] = color;
    })

    drawMaze(newPanel);
});


start();

