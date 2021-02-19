var express = require('express');
const { env } = require('process');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
let users = [];
io.on('connection', (socket) => {
    users.push(socket);
    console.log('A user connected. Total users: ' + users.length);
    io.emit('connected', users.length);
    socket.on('disconnect', () => {
      users.splice(users.indexOf(socket), 1);
      console.log('User disconnected. Total users: ' + users.length);
      io.emit('disconnected', users.length);
    });
    socket.on('chat message', (msg, name) => {
      let i = msg.length;
      if(i <= 1000) { 
        io.emit('chat message', msg, name);
      }
      else {
        console.log('toomuch');
        socket.emit('error');
      }
      });
    socket.on('typing', () => {
      io.emit('typing');
    })
  });
  var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

http.listen(port, () => {
  console.log('listening on *:3000');
});