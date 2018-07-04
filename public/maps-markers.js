
// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
let map;
let markers = [];
var scores;

function processScores(scores) {
  return Object.keys(scores).map((user) => {
    return {user: user, score: scores[user]};
  }).sort((a, b) => {
    return a.score - b.score;
  }).reverse();
}

function formatScore(scores) {
  if (Object.keys(scores).length == 0) {
    return "<p>Nobody has scored yet!</p>";
  } else {
    var str = "<ol>";
    for (var score of processScores(scores)) {
      str += `<li>${score.user}: ${score.score}</li>`
    }
    str += "</ol>";
    return str;
  }
}

function displayGame(gameName) {
  // Update the scan link so it points to the scan page for this game.
  $('#scan-link').attr('href', '/scan/' + gameName);
  $('#game-name').html(gameName);

  $.get('/getBikes?game=' + gameName, function(bikes) {
    console.log(JSON.stringify(bikes));
    scores = {};
    // Process all the bikes!
    for (let bike of bikes) {
      addMarker(bike);
      if (bike.user in scores) {
        scores[bike.user]++;
      } else {
        scores[bike.user] = 1;
      }
    }
    $('#bike-score').html(formatScore(scores));
  });
}

var myBikeImage;
var theirBikeImage;
var shape;

function buildBikeImage(imageName) {
  var bikeImage = {
    url: imageName,
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(16, 32)
  };
  return bikeImage;
}

function initMap() {
  myBikeImage = buildBikeImage('/images/blueBike.png');
  theirBikeImage = buildBikeImage('/images/redBike.png');
  
  shape = {
    coords: [1, 1, 1, 32, 32, 1, 32, 32],
    type: 'poly'
  };

  var googleSeattle = {
    lat: 47.649297,
    lng: -122.350535
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: googleSeattle,
    mapTypeId: 'terrain'
  });

  getGameNameFromUrl()
    .then(displayGame);
}

// Adds a marker to the map and push to the array.
function addMarker(bike) {
  let bikeId = bike.bikeId.replace(/[\W_]+/g,'');
  var infoWindow = new google.maps.InfoWindow({
    content: '<div id="' + bikeId + '"></div>'
  });
  var marker = new google.maps.Marker({
    position: bike.location,
    map: map,
    icon: bike.user == bikeUserName ? myBikeImage : theirBikeImage,
    shape: shape,
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);    
    $('#' + bikeId).load('info-window.html', function() {
      $('#bike-info-title').text('Bike: ' + bikeId.replace('httpwww','').replace('com',''));
      $('#bike-info-owner').text('Owner: ' + bike.user);
      $('#bike-info-owner-score').text('Score: ' + scores[bike.user]);  
    });
  });
  markers.push(marker);
}
