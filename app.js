// app.js
var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var fs = require('fs');
var https = require('https');

var app = express();
var server = http.createServer(app);  
var io = socketIo(server);

app.use(express.static(__dirname + '/node_modules')); 
app.use('/static', express.static('static'));

app.get('/', function(req, res,next) {
  //2
  console.log('2. sending file index.html');
  res.sendFile(__dirname + '/index.html');
});

const options = {
      cert: fs.readFileSync('encryption/fullchain.pem'),
      key: fs.readFileSync('encryption/privkey.pem')
};

var port = 4200
var https_port = 8443
console.log('1.calling for server to start listening from localhost ' + port +
            ' https on ' + https_port);
app.listen(port)
https.createServer(options, app).listen(https_port);
