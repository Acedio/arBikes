
// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
let map;
let markers = [];

function formatScore(scores) {
  var str = "<ol>";
  for (var user in scores) {
    str += `<li>${user}: ${scores[user]}</li>`
  }
  str += "</ol>";
  return str;
}

function getAllBikes() {
  $.get('/getBikes', function(bikes) {
    console.log(JSON.stringify(bikes));
    var scores = {};
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
  myBikeImage = buildBikeImage('images/blueBike.png');
  theirBikeImage = buildBikeImage('images/redBike.png');
  
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

  // This event listener will call addMarker() when the map is clicked.
/*  map.addListener('click', function (event) {
    let location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    addMarker(location);
    $.post('/addBike', {
      user: bikeUserName,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      bikeId: 'idd',
    }, function(data){});
  });*/

  // Adds a marker at the center of the map.
  getAllBikes();
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
      $('#bike-info-title').text('Bike');
      $('#bike-info-owner').text('Owner: ' + bike.user);
      $('#bike-info-owner-score').text('Score: 12');  
    });
  });
  markers.push(marker);
}
