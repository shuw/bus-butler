'use strict'

const actions = require('../actions.js');

actions['list-stops'](
    null,
    {
      loc: '1730 Minor Ave, Seattle, WA',
    },
    (context) => {
      console.log(context.stops);
    }
);
