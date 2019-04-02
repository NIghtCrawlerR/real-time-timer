var express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var path = require('path')
var io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/timer.html');
});

io.on('connection', (socket) => {
    socket.on('start_timer', () => {
        socket.broadcast.emit('start_timer')
    })
    socket.on('loop', () => {
        socket.broadcast.emit('loop')
    })
    socket.on('stop', () => {
        socket.broadcast.emit('stop')
    })
    socket.on('clear', () => {
        socket.broadcast.emit('clear')
    })
})

http.listen(3020, function () {
    console.log('listening on *:3020');
});