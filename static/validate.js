(function(exports) {
  exports.validateCode = (code) => {
    // TODO: Verify that it's a URL since jsQR seems a bit noisy.
    return true;
  }

  exports.validateLocation = (location) => {
    // TODO: Validate the latlng is within the play space and that accuracy is
    // high enough.
    return true;
  }
} (typeof exports === 'undefined' ? this.validate = {} : exports));
