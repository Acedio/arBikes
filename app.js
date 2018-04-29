// app.js
var express = require('express');
var http = require('http');
var bodyParser = require("body-parser");
var socketIo = require('socket.io');
var fs = require('fs');
var https = require('https');

var app = express();
var server = http.createServer(app);  
var io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/node_modules')); 
app.use(express.static(__dirname + '/static')); 

app.get('/', function(req, res,next) {
  console.log('2. sending file index.html');
  res.sendFile(__dirname + '/index.html');
});


var testBikes = [
  {
    user: 'goo',
    location: {
      lat: 47.649297,
      lng: -122.350535
    },
    bikeId: 'url11',
  },
  {
    user: 'foo',
    location: {
      lat: 47.649753,
      lng: -122.351683
    },
    bikeId: 'url12',
  },
];

var bikes = testBikes;

app.get('/getBikes', function(req, res, next) {
  res.send(bikes);
});

/** Takes {user, location: {lat, lng}, bikeId} */
app.post('/addBike', function(req, res, next) {
  let bike = req.body;
  bike.location = {
    lat: parseFloat(bike.location.lat),
    lng: parseFloat(bike.location.lng),
  };
  bikes.push(bike);
});

var port = 4200
var https_port = 8443
const ssl_options = {
      cert: fs.readFileSync('encryption/fullchain.pem'),
      key: fs.readFileSync('encryption/privkey.pem')
};

console.log('1.calling for server to start listening from localhost ' + port +
            ' https on ' + https_port);
app.listen(port);
https.createServer(ssl_options, app).listen(https_port);
