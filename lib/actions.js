'use strict';

const sessions = require('./sessions.js');
const fbMessage = require('./fbMessage.js');
const api = require('./OneBusAwayApi.js');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Our bot actions
module.exports = {

  say: (sessionId, context, message, cb) => {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions.get(sessionId).fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      fbMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Let's give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      cb();
    }
  },

  merge: (sessionId, context, entities, message, cb) => {
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      context.loc = loc;
    }
    cb(context);
  },

  'list-stops': (sessionId, context, cb) => {
    api.getStops(context.loc);
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.forecast = 'sunny';
    cb(context);
  },
  error: (sessionId, context, error) => {
    console.log(error.message);
  },

};
