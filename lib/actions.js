'use strict';

const util = require('util');
const sessions = require('./sessions.js');
const fbMessage = require('./fbMessage.js');
const api = require('./OneBusAwayApi.js');
const _ = require('underscore');

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

const listStops = (sessionId, context, cb) => {
  api.getStops(
    context.loc,
    (stops) => {
      if (!stops) {
        cb(context);
        return;
      }

      var stopsData = [];
      var message = "";
      stops = _(stops).chain().take(4).each((stop) => {
        message += "\n" + stop.name + "\n";
        _(stop.routes).each((route) => {
          const description = util.format(
            "%s. %s %s\n",
            stopsData.length + 1,
            route.name,
            stop.direction
          );

          if ((description.length + message.length) >= 300) {
            return;
          }

          stopsData.push({
            stop: stop,
            route: route
          });

          message += description;
        });

      });

      context.stops = message;
      context.stopsData = stops;

      cb(context);
    }
  );
}

const getArrivalTime = (sessionId, context, cb) => {
  context.arrival_time = '8 minutes';
  cb(context);
  setTimeout(() => {
    const recipientId = sessions.get(sessionId).fbid;
    fbMessage(
      recipientId,
      "Your bus will be delayed by 5 minutes, and is arriving in 13 minutes."
    );
  }, 5 * 1000);
}

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

    if (context.stops) {
      context.stop_choice = firstEntityValue(entities, 'number');
    }

    cb(context);
  },

  'list-stops': listStops,

  'get-arrival-time': getArrivalTime,

  error: (sessionId, context, error) => {
    console.log(error.message);
  },

};
