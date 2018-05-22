const functions = require('firebase-functions');
// TODO: shared validation

exports.getBikes = functions.https.onRequest((req, res) => {
  // TODO
  var bikes = {};
  // Return all the values (no keys) of the bikes dictionary.
  res.send(Object.keys(bikes).map(key => { return bikes[key];}));
});

/** Takes {user, location: {lat, lng, acc}, bikeId} */
exports.addBike = functions.https.onRequest((req, res) => {
  // TODO
  var bikes = {};
  var found = {};
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
    if (bikes[bike].bikeId === found.bikeId) {
      if (bikes[bike].user === found.user) {
        res.send("You already own this bike!");
        return;
      } else {
        res.send("Stolen!");
        bikes[bike] = found
        return;
      }
    }
  }
  bikes[found.bikeId] = found;
  res.send("Claimed!");
});
