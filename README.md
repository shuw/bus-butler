# Bus Butler

This is a chat bot that helps you get to work via public transportation.

## Installation
Instructions on [integrating with Messenger Platform](https://github.com/wit-ai/node-wit#messenger-integration-example)
Copy set-env-example.sh set-env.sh and edit with your own config.

Install node modules:
```
npm install
```

## Start Messenger Server
```
ngrok http 8445
. set-env.sh
node messenger.js // or node interactive.js
```

## Start Interactive
```
. set-env.sh
node interactive.js
```
