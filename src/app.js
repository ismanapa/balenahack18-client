
var socket = require('socket.io-client')('http://10.10.1.88:8000');
socket.on('connect', function(){ console.log('connected raspberry') });
socket.on('event', function(data){ });
socket.on('disconnect', function(){});

socket.emit('chat message', 'hola hamijo, soy una raspi');