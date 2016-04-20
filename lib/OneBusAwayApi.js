'use strict';

const GoogleMapsAPI = require('googlemaps');

var gm = new GoogleMapsAPI({
  key: process.env.GMAPS_KEY,
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
});

module.exports = {

  getStops: (loc, cb) => {
    console.log("list stops for: " + loc);
    gm.geocode({address: loc}, (err, result) => {
      console.log(result);
    });
  }

}
