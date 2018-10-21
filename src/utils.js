var { 
	ZOMBIE_COLOR, 
	SURVIVOR_COLOR, 
	MY_ZOMBIE_COLOR, 
	MY_SURVIVOR_COLOR 
} = require('./colors');
var UserRole = require('./role');
var WIDTH = require('./settings');
var HEIGHT = require('./settings');

class Utils {
	GetPosition(x, y) {
		if (x < 0 || x >= WIDTH) {
			throw new Error(`x is out of bounds: ${x}`);
		}
		if (y < 0 || y >= HEIGHT) {
			throw new Error(`y is out of bounds: ${y}`);
		}
		return (WIDTH * x) + y;
	};
	
	getColor(role, isThisPlayer) {
		switch(role) {
			case UserRole.survivor:
				return isThisPlayer ? MY_SURVIVOR_COLOR : SURVIVOR_COLOR;
			case UserRole.zombie:
				return isThisPlayer ? MY_ZOMBIE_COLOR : ZOMBIE_COLOR;
		}
	}
}

module.exports = Utils;