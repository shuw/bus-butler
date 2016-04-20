'use strict';

if (process.env.IS_INTERACTIVE) {
  const session = {
    fbid: 1
  }

  module.exports = {
    get: (sessionID) => {
      return session;
    }
  }
  return;
}


// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

module.exports = {

  get: (sessionID) => {
    return sessions[sessionID];
  },

  findOrCreate: (fbid) => {
    let sessionId;
    // Let's see if we already have a session for the user fbid
    Object.keys(sessions).forEach(k => {
      if (sessions[k].fbid === fbid) {
        // Yep, got it!
        sessionId = k;
      }
    });
    if (!sessionId) {
      // No session found for user fbid, let's create a new one
      sessionId = new Date().toISOString();
      sessions[sessionId] = {fbid: fbid, context: {}};
    }
    return sessionId;
  }

}
