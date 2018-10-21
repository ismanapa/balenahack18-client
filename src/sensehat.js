const senseLeds = require('sense-hat-led');
const senseJoystick = require('sense-joystick');

const printPanel = (panel) => {
    senseLeds.setPixels(panel);
}

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