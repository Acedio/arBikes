function getUserName() {
  return new Promise((resolve, reject) => {
    var userName = Cookies.get('bikeUserName');
    if (userName == '' || userName == 'undefined' || userName == null) {
      reject(new Error('Username unset.'));
    } else {
      resolve(userName);
    }
  });
}

function setUserName(userName) {
  Cookies.set('bikeUserName', userName);
}

function getGameNameFromUrl() {
  const gameRegex = /(?:game|scan)\/([^\/]*)/;
  const match = gameRegex.exec(window.location.pathname);
  if (match) {
    return Promise.resolve(match[1]);
  } else {
    return Promise.reject(new Error('Game name not found.'));
  }
}
