var {SERVER_HOST} = require('./config');
var {SERVER_PORT} = require('./config');
var {Utils} = require('./utils');
var {SenseHat} = require('./sensehat');
var {Panel} = require('./panel');
var {Player} = require('./player');

const senseJoystick = require('sense-joystick');
const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);
const player = new Player();

socket.on('connect', () => { 
    console.log('connected new player');
    for(var second = 3; second >= 0; second--) {
        setInterval(function(){ 
            SenseHat.printPanel(Panel.countDown[second]);
        }, 1000);
    }
});

socket.on('disconnect', () => { 
    SenseHat.printPanel(Panel.cross);
});

socket.on('start', (newUser) => {
    player = Object.assign(player, newUser);
    var position = Utils.getPosition(player.position.x, player.position.y);

    var newPanel = Panel.empty.slice(0);
    newPanel[position] = Utils.getColor(player.role);

    SenseHat.printPanel(newPanel);
});

socket.on('update', (users) => {
    var newPanel = Panel.empty.slice(0);
    users.map((user) => {
        var position = Utils.getPosition(user.position.x, user.position.y);
        var color = Utils.getColor(user.role, user.id === player.id);
        newPanel[position] = color;
    })

    SenseHat.printPanel(newPanel);
});

const start = () => {
    SenseHat.printPanel(cross);
}

start();
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
        socket.emit("move", {id: player.id, move:{ x: x, y: y }})
    });
});