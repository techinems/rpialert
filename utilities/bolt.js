//node packages
const { App } = require("@slack/bolt");

//globals
const TOKEN = process.env.SLACK_BOT_TOKEN;
const SECRET = process.env.SLACK_SIGNING_SECRET;
const PORT = process.env.NODE_PORT || 3000;

//package config
const app = new App({
  token: TOKEN,
  signingSecret: SECRET
});

(async () => {
  await app.start(PORT);
  console.log(`at-channel running on port ${PORT}...`);
})();

module.exports = { app };
