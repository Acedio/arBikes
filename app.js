// app.js
var express = require('express');
var http = require('http');
var socketIo = require('socket.io');

var app = express();
var server = http.createServer(app);  
var io = socketIo(server);

app.use(express.static(__dirname + '/node_modules')); 
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res,next) {  
  //2
  console.log('2. sending file index.html');
  res.sendFile(__dirname + '/index.html');
});

var bikeCoordinates = [
  { lat: 37.769, lng: -122.446 },
  { lat: 37.779, lng: -122.446 },
];

app.get('/getBikes', function(req, res, next) {
  res.send(bikeCoordinates);
});

//1
var port = 4200
console.log('1.calling for server to start listening from localhost ' + port);
server.listen(port);
