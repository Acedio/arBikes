// app.js
var express = require('express');
var http = require('http');
var bodyParser = require("body-parser");
var socketIo = require('socket.io');
var fs = require('fs');
var https = require('https');
var validate = require('./static/validate.js')

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
    user: 'goo',
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

/** Takes {user, location: {lat, lng, acc}, bikeId} */
app.post('/addBike', function(req, res, next) {
  found = {}
  found.user = req.body.user;
  found.location = {
    lat: parseFloat(req.body.location.lat),
    lng: parseFloat(req.body.location.lng),
    acc: parseFloat(req.body.location.acc),
  };
  if (!validate.validateLocation(found.location)) {
    console.log('Invalid location: ' + found.location);
    return;
  }
  found.bikeId = req.body.bikeId;
  if (!validate.validateCode(found.bikeId)) {
    console.log('Invalid bikeId: ' + found.bikeId);
    return;
  }
  for (var bike in bikes) {
    if (bikes[bike].bikeId == found.bikeId) {
      if (bikes[bike].user == found.user) {
        res.send("You already own this bike!");
        return;
      } else {
        res.send("Stolen!");
        bikes[bike] = found
        return;
      }
    }
  }
  bikes.push(found);
  res.send("Claimed!");
});

var port = 4200
var https_port = 8443
const ssl_options = {
  cert: fs.readFileSync('encryption/fullchain.pem'),
  key: fs.readFileSync('encryption/privkey.pem')
};

console.log('1.calling for server to start listening from localhost ' + port +
            ' https on ' + https_port);
app.listen(port)
https.createServer(ssl_options, app).listen(https_port);
