'use strict';

const actions = require('./lib/actions.js')
const sessions = require('./lib/sessions.js')
const Wit = require('node-wit').Wit;

const WIT_TOKEN = process.env.WIT_TOKEN;

const client = new Wit(WIT_TOKEN, actions);
client.interactive();
