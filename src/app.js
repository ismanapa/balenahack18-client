
export { colors, pannels, config, settings, role, utils, sensehat }

const socket = require('socket.io-client')(`http://${SERVER_HOST}:${SERVER_PORT}`);

socket.on('connect', () => { 
    console.log('connected new player');
    for(var second = 3; second >= 0; second--) {
        setInterval(function(){ 
            printPanel(countDown[second]);
        }, 1000);
    }
});

socket.on('disconnect', () => { 
    printPanel(cross);
});

socket.on('start', (newUser) => {
    player = Object.assign(player, newUser);
    var newPanel = emptyMaze.slice(0);
    var position = GetPosition(player.position.x, player.position.y);
    newPanel[position] = getColor(player.role);
    printPanel(newPanel);
});

socket.on('update', (users) => {
    var newPanel = emptyMaze.slice(0);
    users.map((user) => {
        var position = GetPosition(user.position.x, user.position.y);
        var color = getColor(user.role, user.id === player.id);
        newPanel[position] = color;
    })

    printPanel(newPanel);
});

const start = () => {
    printPanel(cross);
}

start();