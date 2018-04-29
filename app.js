// app.js
var express = require('express');
var http = require('http');
var socketIo = require('socket.io');

var app = express();
var server = http.createServer(app);  
var io = socketIo(server);

app.use(express.static(__dirname + '/node_modules')); 

app.get('/', function(req, res,next) {  
  //2
  console.log('2. sending file index.html');
  res.sendFile(__dirname + '/index.html');
});

//1
console.log('1.calling for server to start listening from localhost 4200');
server.listen(4200);
