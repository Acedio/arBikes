
// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];

function getAllBikes() {
  $.get('/getBikes', function(bikes) {
    console.log(JSON.stringify(bikes));
    // Process all the bikes!
    for (let bike of bikes) {
      addMarker(bike.location);
    }
  });
}

function initMap() {
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
    map: map
  });
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
