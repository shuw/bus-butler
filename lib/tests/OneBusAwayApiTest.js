'use strict';

const api = require('../OneBusAwayApi.js')

api.getStops('1730 Minor Ave, Seattle, WA', (results) => {
  console.log(results);
});


