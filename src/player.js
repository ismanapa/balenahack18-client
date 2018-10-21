import { UserRole } from 'role.js'
import { MY_SURVIVOR_COLOR } from 'colors.js'

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