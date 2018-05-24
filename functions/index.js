const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
const validate = require('./shared/validate')

// Instantiates a client
const datastore = Datastore();

const BIKE_KIND = 'Bike';

// TODO: shared validation

exports.getBikes = functions.https.onRequest((req, res) => {
  const query = datastore
    .createQuery(BIKE_KIND)
    .filter('game', '=', 'Fremont');  // TODO: Read this from req.body.game

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

function getBike(game, bike) {
  const query = datastore
    .createQuery(BIKE_KIND)
    .filter('game', '=', game)
    .filter('bikeId', '=', bikeId);

  return datastore.runQuery(query)
    .then((data) => {
      var entities = data[0];
      if (entities.length > 1) {
        throw new Error("Duplicate bike IDs found for game " +
                        game + " bikeId " + bikeId);
      }
      if (entities.length === 0) {
        return null;
      }
      return entities[0];
    });
}

function saveBike(key, bike) {
  const entity = {
    key: key,
    data: bike,
  };

  return datastore.save(entity);
}

/** Takes {game, user, location: {lat, lng, acc}, bikeId} */
exports.addBike = functions.https.onRequest((req, res) => {
  var found = {};
  found.user = req.body.user;
  found.game = req.body.game;
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

  getBike(found.game, found.bikeId)
    .then(bike => {
      // Simply add the bike if it's unclaimed.
      if (bike === null) {
        return saveBike(datastore.key(BIKE_KIND), found)
          .then((data) => {
            return res.status(200).send("Claimed!")
          });
      }

      if (bike.user === found.user) {
        return res.status(200).send("You already own this bike!");
      } else {
        const entity = {
          key: bike[datastore.KEY],
          data: found,
        };

        return saveBike(bike[datastore.KEY], bike)
          .then((data) => {
            return res.send("Stolen!");
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err.message);
    });
});
