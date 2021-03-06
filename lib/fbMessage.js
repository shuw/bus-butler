'use strict';

const request = require('request');
const S = require('string');

const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;

const fbReq = request.defaults({
  uri: 'https://graph.facebook.com/me/messages',
  method: 'POST',
  json: true,
  qs: { access_token: FB_PAGE_TOKEN },
  headers: {'Content-Type': 'application/json'},
});

module.exports = (recipientId, msg, cb) => {
  if (process.env.IS_INTERACTIVE) {
    console.log(msg);
    if (cb) {
      cb();
    }
    return;
  }

  const opts = {
    form: {
      recipient: {
        id: recipientId,
      },
      message: {
        text: S(msg).truncate(310).s,
      },
    },
  };

  fbReq(opts, (err, resp, data) => {
    if (cb) {
      cb(err || data.error && data.error.message, data);
    }
  });
};
