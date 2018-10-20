
const senseLeds = require('sense-hat-led');
const senseJoystick = require('sense-joystick');

const SERVER_HOST = process.env.SERVER_HOST || 'http://10.10.1.95';
const SERVER_PORT = process.env.SERVER_PORT || '8000';
const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);

const MY_COLOR = process.env.MY_COLOR || [255, 255, 255];
const BLACK_COLOR = [23, 144, 47];

let userData = {
    id: '',
    position: {
        x: 0,
        y: 0
    },
    color: '',
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

socket.on('connect', () => { 
    console.log('connected new player');
});


socket.on('start', function(newUser){
    userData = Object.assign(userData, newUser);

});

drawMaze(mazes.none);
