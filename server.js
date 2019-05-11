//node packages
const axios = require("axios");
require("dotenv").config();

//local packages
const {
  app: {
    client: {
      chat: { postMessage }
    }
  }
} = require("./utilities/bolt.js");

//globals
const RPIALERT_URL = "https://alert.rpi.edu/alerts.js";
const USER_TOKEN = process.env.SLACK_USER_TOKEN;

//package config

let text = "";
let oldtext = "";

const parseAlertData = body => {
  return body.substring(
    body.indexOf("alert_content = ") + 17,
    body.indexOf("alert_default = ") - 3
  );
};

const rpialert = async () => {
  const { data } = await axios.get(RPIALERT_URL);

  text = parseAlertData(data);

  if (text != oldtext && text != "") {
    postMessage({
      token: USER_TOKEN,
      channel: "alerts",
      unfurl_links: false,
      text: "RPI ALERT - <!channel>",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<!channel>\nAn RPIAlert has been posted:\n>>>${text}`
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "image",
              image_url:
                "https://emoji.slack-edge.com/T351C3UGL/rpi/a494ab4a33755c38.png",
              alt_text: "rpi_logo"
            },
            {
              type: "mrkdwn",
              text: " More info: https://alert.rpi.edu"
            }
          ]
        }
      ]
    });
  }
  oldtext = text;
};

setInterval(function() {
  rpialert();
}, 10000);
