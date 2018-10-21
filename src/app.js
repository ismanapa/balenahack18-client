const senseLeds = require('sense-hat-led');
const senseJoystick = require('sense-joystick');
export { colors, pannels, config, settings, role, utils }

const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);

//EVENTS
socket.on('connect', () => { 
    console.log('connected new player');
    for(var second = 3; second >= 0; second--) {
        setInterval(function(){ 
            senseLeds.setPixels(countDown[second]);
        }, 1000);
    }
});

socket.on('disconnect', () => { 
    senseLeds.setPixels(cross);
});

socket.on('start', (newUser) => {
    player = Object.assign(player, newUser);
    var newPanel = emptyMaze.slice(0);
    var position = GetPosition(player.position.x, player.position.y);
    newPanel[position] = getColor(player.role);
    senseLeds.setPixels(newPanel);
});

socket.on('update', (users) => {
    var newPanel = emptyMaze.slice(0);
    users.map((user) => {
        var position = GetPosition(user.position.x, user.position.y);
        var color = getColor(user.role, user.id === player.id);
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
       socket.emit("move", {id: player.id, move:{ x: x, y: y }})
    });
});

const start = () => {
    senseLeds.setPixels(cross);
}

start();