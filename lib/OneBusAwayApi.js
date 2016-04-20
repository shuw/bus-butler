'use strict';

const querystring = require('querystring');
const util = require('util');
const request = require('request');
const GoogleMapsAPI = require('googlemaps');
const _ = require('underscore');

const ONE_BUS_AWAY_KEY = process.env.ONE_BUS_AWAY_KEY || 'test';

var gm = new GoogleMapsAPI({
  key: process.env.GMAPS_KEY,
  stagger_time:       1000, // for elevationPath
  encode_polylines:   false,
  secure:             true, // use https
});

const getOneBusAwayURL = (method, params) => {
  return util.format(
    "http://api.pugetsound.onebusaway.org/api/where/%s.json?key=%s&%s",
    method,
    ONE_BUS_AWAY_KEY,
    querystring.stringify(params)
  );
};

module.exports = {

  getStops: (loc, cb) => {
    gm.geocode({address: loc}, (err, result) => {
      if (!result || !result.results) {
        cb(null)
        return
      }

      const place = result.results[0]
      request(
        getOneBusAwayURL('stops-for-location', {
          lat: place.geometry.location.lat,
          lon: place.geometry.location.lng
        }),
        (error, response, body) => {
          if (error) {
            cb(null);
            return;
          }
          const data = JSON.parse(body).data;

          const routes = {};
          _(data.references.routes).each((route) => {
            routes[route.id] = route;
          });

          cb(
            _(data.list).map((stop) => {
              return {
                name: stop.name,
                direction: stop.direction,
                routes: _(stop.routeIds).map((id) => {
                  const route = routes[id];
                  return {
                    id: id,
                    name: route.longName || route.shortName,
                  };
                })
              };
            })
          );
        }
      );
    });
  }

}
