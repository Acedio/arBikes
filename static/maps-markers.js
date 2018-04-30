
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
      addMarker(bike.location);
      if (bike.user in scores) {
        scores[bike.user]++;
      } else {
        scores[bike.user] = 1;
      }
    }
    $('#bike-score').html(formatScore(scores));
  });
}

var image;
var shape;

function initMap() {
  image = {
    url: 'images/blueBike.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(16, 32)
  };
  
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
  map.addListener('click', function (event) {
    let location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    addMarker(location);
    $.post('/addBike', {
      user: 'meee',
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      bikeId: 'idd',
    }, function(data){});
  });

  // Adds a marker at the center of the map.
  getAllBikes();
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: image,
    shape: shape,
  });
  markers.push(marker);
}
