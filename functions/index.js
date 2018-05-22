const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();

// TODO: shared validation

exports.getBikes = functions.https.onRequest((req, res) => {
  const query = datastore.createQuery('Bike');
  // TODO: share the bike query with addBike
  return datastore.runQuery(query)
    .then((data) => {
      var entities = data[0];
      return res.status(200).send(entities);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err.message);
    });
});

/** Takes {user, location: {lat, lng, acc}, bikeId} */
exports.addBike = functions.https.onRequest((req, res) => {
  var found = {};
  found.user = req.body.user;
  found.location = {
    lat: parseFloat(req.body.location.lat),
    lng: parseFloat(req.body.location.lng),
    acc: parseFloat(req.body.location.acc),
  };
  /*
  if (!validate.validateLocation(found.location)) {
    console.log('Invalid location: ' + found.location);
    return;
  }
  */
  found.bikeId = req.body.bikeId;

  const entity = {
    key: datastore.key("Bike"),
    data: found,
  };

  return datastore.save(entity)
    .then((data) => {
      return res.status(200).send("Claimed!")
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err.message);
    });
  /*
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
  */
});
