var UserRole = require('./role');
var MY_SURVIVOR_COLOR = require('./colors');

class player {
    id;
    position;
    color;
    role;

    constructor() {
        this.id = 1;
        this.position = {x: 0, y: 0}
        this.role = UserRole.survivor,
        this.color = MY_SURVIVOR_COLOR
    }
};

module.exports = Player;