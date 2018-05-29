const functions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
const validate = require('./shared/validate')

// Instantiates a client
const datastore = Datastore();

const GAME_KIND = 'Game';
const BIKE_KIND = 'Bike';

function getGameKey(gameName) {
  return datastore.key([GAME_KIND, gameName]);
}

exports.getBikes = functions.https.onRequest((req, res) => {
  if (!req.query.game) {
    console.error('No game specified.');
    return res.status(500).send('No game specified.');
  }
  const query = datastore
    .createQuery(BIKE_KIND)
    .hasAncestor(getGameKey(req.query.game));

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

function getBike(transaction, game, bikeId) {
  const query = transaction
    .createQuery(BIKE_KIND)
    .hasAncestor(getGameKey(game))
    .filter('bikeId', '=', bikeId);

  return transaction.runQuery(query)
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

// bike is of type BIKE_KIND
function saveBike(transaction, key, bike) {
  const entity = {
    key: key,
    data: bike,
  };

  transaction.save(entity);
}

/** Takes {game, user, location: {lat, lng, acc}, bikeId} */
exports.addBike = functions.https.onRequest((req, res) => {
  var found = {};
  if (!req.body.user) {
    console.log('Invalid username: ' + req.body.user);
  }
  found.user = req.body.user;
  if (!req.body.game) {
    console.log('Invalid gamename: ' + req.body.game);
  }
  found.game = req.body.game;
  found.location = {
    lat: parseFloat(req.body.location.lat),
    lng: parseFloat(req.body.location.lng),
    acc: parseFloat(req.body.location.acc),
  };
  if (!validate.validateLocation(found.location)) {
    console.log('Invalid location: ' + found.location);
    return res.status(500).send('Invalid location.');
  }
  if (!validate.validateCode(req.body.bikeId)) {
    console.log('Invalid bikeId: ' + req.body.bikeId);
    return res.status(500).send('Invalid bikeId.');
  }
  found.bikeId = req.body.bikeId;

  const transaction = datastore.transaction();

  return transaction
    .run()
    .then(() => getBike(transaction, found.game, found.bikeId))
    .then(bike => {
      // Simply add the bike if it's unclaimed.
      if (bike === null) {
        saveBike(
            transaction, datastore.key([GAME_KIND, found.game, BIKE_KIND]),
            found);
        return "Claimed!";
      }

      if (bike.user === found.user) {
        return "You already own this bike!";
      } else {
        const entity = {
          key: bike[datastore.KEY],
          data: found,
        };

        saveBike(transaction, bike[datastore.KEY], found);
        return "Stolen!";
      }
    })
    .then((result_str) => {
      transaction.commit();
      return res.status(200).send(result_str);
    })
    .catch((err) => {
      transaction.rollback();
      console.error(err);
      return res.status(500).send(err.message);
    });
});
