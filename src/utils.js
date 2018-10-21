var { 
	ZOMBIE_COLOR, 
	SURVIVOR_COLOR, 
	MY_ZOMBIE_COLOR, 
	MY_SURVIVOR_COLOR 
} = require('./colors');
var userRole = require('./role');
var WIDTH = require('./settings');
var HEIGHT = require('./settings');

export class Utils {
	GetPosition = (x, y) => {
		if (x < 0 || x >= WIDTH) {
			throw new Error(`x is out of bounds: ${x}`);
		}
		if (y < 0 || y >= HEIGHT) {
			throw new Error(`y is out of bounds: ${y}`);
		}
		return (WIDTH * x) + y;
	};
	
	getColor = (role, isThisPlayer) => {
		switch(role) {
			case userRole.survivor:
				return isThisPlayer ? MY_SURVIVOR_COLOR : SURVIVOR_COLOR;
			case userRole.zombie:
				return isThisPlayer ? MY_ZOMBIE_COLOR : ZOMBIE_COLOR;
		}
	}
}