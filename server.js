//node packages
const axios = require("axios");
const crypto = require("crypto");

require("dotenv").config();

//local packages
const {
  app: {
    client: {
      conversations: { history },
      chat: { postMessage }
    }
  }
} = require("./utilities/bolt.js");

//globals
const RPIALERT_URL =
  process.env.RPIALERT_URL || "https://alert.rpi.edu/alerts.js";
const ALERTS_CHANNEL = process.env.ALERTS_CHANNEL;
const USER_TOKEN = process.env.SLACK_USER_TOKEN;

//package config

let oldHash;

const parseAlertData = body => {
  return body
    .substring(
      body.indexOf("alert_content = ") + 17,
      body.indexOf("alert_default = ") - 3
    )
    .trim();
};

const rpialert = async () => {
  const { data } = await axios.get(RPIALERT_URL);

  let text = parseAlertData(data);
  if (text === "") {
    return;
  }

  let hash = crypto
    .createHash("md5")
    .update(text)
    .digest("hex");

  if (hash !== oldHash) {
    postMessage({
      token: USER_TOKEN,
      channel: ALERTS_CHANNEL,
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
            },
            {
              type: "plain_text",
              text: hash
            }
          ]
        }
      ]
    });
  }
  oldHash = hash;
};

function filterBotMessages(messages) {
  return messages.filter((message) => {
    return (
      message.subtype === "bot_message"
      && message.text === "RPI ALERT - <!channel>"
    );
  });
}

async function getOldHash() {
  let cursor;
  do {
    let results = await history({
      token: USER_TOKEN,
      channel: ALERTS_CHANNEL,
      cursor: cursor
    });
    let messages = filterBotMessages(results.messages);
    if (messages.length > 0) {
      if (messages[0].blocks[1].elements[2]) {
        oldHash = messages[0].blocks[1].elements[2].text;
      }
    }
    else {
      if (results.response_metadata && results.response_metadata.next_cursor) {
        cursor = results.response_metadata.next_cursor;
      }
    }
  } while(!oldHash && (cursor !== null || cursor !== undefined));
}

getOldHash().then(() => {
  setInterval(function() {
    rpialert();
  }, 10000);
});
