/**
 * Websocket server:
 *  - Listen for incoming connections
 *  - if the incoming message.type = 'suscribe' then get the channelId to subscribe to
 *
 * Express server:
 *  - Expose a REST API with POST /publish/:channelId
 *  - The body of the request will be the message to publish
 *  - The server will send the message to all the clients subscribed to the channelId
 */

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");
const WebSocketService = require("./handlers/websocketHandler");
const checkTimeOut = require("./utils/timeoutCheck");
const httpServerHandler = require("./handlers/httpServerHandler");
const dotenv = require("dotenv");
dotenv.config();

// Create an Express server and HTTP server
const app = express();
const server = http.createServer(app);

// Parse JSON bodies
app.use(bodyParser.json());

// Create a WebSocket server
const wss = new WebSocket.Server({
  server,
  path: "/ws",
  perMessageDeflate: false,
});

// WebSocket server
wss.on("connection", WebSocketService.handleConnection);

// Express server
app.post("/publish/:channelId", httpServerHandler.publishHandler);

app.get("/", (req, res) => {
  res.send({
    message: "Hello world! Welcome to v1 of HEIDI Websocket!",
  });
});

checkTimeOut();

// Start the server
const PORT = process.env.PORT;
if (!PORT) {
  console.error("Please provide the PORT");
  process.exit(1);
}
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
