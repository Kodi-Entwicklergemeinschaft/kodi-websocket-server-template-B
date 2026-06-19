const subscriptions = require("../subscriptions");
const WebSocket = require("ws");

const publishHandler = (req, res) => {
  const { channelId } = req.params;
  const accessToken = req.query.accessToken;
  if (accessToken !== process.env.ACCESS_TOKEN) {
    res
      .status(401)
      .send(JSON.stringify({ error: true, message: "Unauthorized" }));
    return;
  }
  if (!channelId || !subscriptions[channelId]) {
    res
      .status(404)
      .send(JSON.stringify({ error: true, message: "Channel not found" }));
    return;
  }
  if (!Object.keys(subscriptions[channelId]).length) {
    res
      .status(404)
      .send(
        JSON.stringify({
          error: true,
          message: "No clients subscribed to the channel",
        }),
      );
    return;
  }

  if (subscriptions[channelId]) {
    Object.keys(subscriptions[channelId]).forEach((uuid) => {
      const ws = subscriptions[channelId][uuid];
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(req.body));
      }
    });
  }

  res.status(200).send(JSON.stringify({ message: "Message sent" }));
};

module.exports = {
  publishHandler,
};
