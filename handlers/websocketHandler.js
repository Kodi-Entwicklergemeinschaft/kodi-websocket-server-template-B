const generateUUID = require("../utils/uuidGen");
const subscriptions = require("../subscriptions");

const handleConnection = (ws) => {
  ws.lastPing = Date.now();
  ws.uuid = generateUUID();
  subscriptions.tempChannel[ws.uuid] = ws;
  ws.on("message", (message) => {
    try {
      handleMessage(ws, message);
    } catch (error) {
      delete subscriptions.tempChannel[ws.uuid];
      ws.terminate();
    }
  });
  ws.on("close", () => {
    delete subscriptions.tempChannel[ws.uuid];
    ws.terminate();
  });
};

const handleMessage = (ws, message) => {
  ws.lastPing = Date.now();
  const data = JSON.parse(message);
  if (data.type === "subscribe") handleNewSubscription(data.channelId, ws);
  else if (data.type === "ping") handlePing(ws);
  else if (data.type === "unsubscribe") handleUnsubscribe(data.channelId, ws);
};

const handleNewSubscription = (channelId, ws) => {
  if (!subscriptions[channelId]) {
    subscriptions[channelId] = {};
  }
  subscriptions[channelId][ws.uuid] = ws;
  // remove the tempChannel subscription
  delete subscriptions.tempChannel[ws.uuid];

  // Send acknowledgment for successful subscription
  ws.send(
    JSON.stringify({
      type: "subscription_ack",
      message: `Subscribed to channel: ${channelId}`,
    })
  );

  console.log(`Client subscribed to channel: ${channelId}`);
};

const handlePing = (ws) => {
  ws.lastPing = Date.now();
  ws.send(JSON.stringify({ type: "pong" }));
};

const handleUnsubscribe = (channelId, ws) => {
  if (subscriptions[channelId] && subscriptions[channelId][ws.uuid]) {
    ws.terminate();
    delete subscriptions[channelId][ws.uuid];
  }
};

module.exports = {
  handleConnection,
};
