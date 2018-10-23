const { SERVER_HOST, SERVER_PORT } = require('./config');
const Utils = require('./utils');
const Panel = require('./panel');
const Player = require('./player');

const senseJoystick = require('sense-joystick');
const senseLeds = require('sense-hat-led');
const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);

const panel = new Panel();
const utils = new Utils();
let player = new Player();

const start = () => {
    senseLeds.setPixels(panel.cross);
    socket.on('connect', () => { 
        setTimeout(function(){ 
            senseLeds.setPixels(panel.countDown[3]);
        }, 0);
        setTimeout(function(){ 
            senseLeds.setPixels(panel.countDown[2]);
        }, 1000);
        setTimeout(function(){ 
            senseLeds.setPixels(panel.countDown[1]);
        }, 2000);
        setTimeout(function(){ 
            senseLeds.setPixels(panel.countDown[0]);
        }, 3000);
    });

    socket.on('disconnect', () => { 
        senseLeds.setPixels(panel.cross);
    });

    socket.on('start', (newUser) => {
        player = Object.assign(player, newUser);
        const position = utils.getPosition(player.position.x, player.position.y);

        let newPanel = panel.empty.slice(0);
        newPanel[position] = utils.getColor(player.role);

        senseLeds.setPixels(newPanel);
    });

    socket.on('update', (users) => {
        let newPanel = panel.empty.slice(0);
        users.map((user) => {
            const position = utils.getPosition(user.position.x, user.position.y);
            const color = utils.getColor(user.role, user.id === player.id);
            newPanel[position] = color;
        })

        senseLeds.setPixels(newPanel);
    });

    senseJoystick.getJoystick()
        .then((joystick) => {
            joystick.on('press', (val) => {
                let x = 0;
                let y = 0;
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
}

start();