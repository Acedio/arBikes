// TODO: Make this not a global variable but import this file into other scripts or some such.
bikeUserName = '';

$(document).ready(function() {
  bikeUserName = Cookies.get('bikeUserName');
  // coookies returns actual string value undefined.
  if (bikeUserName == 'undefined' || bikeUserName == null) {
    setPopUpPanelVisibility(true);
  }
});

function submitName() {
  bikeUserName = $('#user-name').val();
  console.log(bikeUserName);
  Cookies.set('bikeUserName', bikeUserName);
  setPopUpPanelVisibility(false);
}

function setPopUpPanelVisibility(toShow) {
  let popUpPanel = $('.pop-up-panel');
  if (popUpPanel && !toShow) {
    popUpPanel.hide();
  }
  if (popUpPanel && toShow) {
    popUpPanel.show();
  }
}
