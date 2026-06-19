const timeConsts = require("../constants/time");
const subscriptions = require("../subscriptions");

const checkTimeOut = () => {
  setTimeout(() => {
    Object.keys(subscriptions).forEach((subscription) => {
      // const ws = subscriptions[subscription];
      Object.keys(subscriptions[subscription]).forEach((uuid) => {
        const ws = subscriptions[subscription][uuid];
        if (ws.lastPing < Date.now() - timeConsts.ACTIVE_CONNECTION_TIMEOUT) {
          // remove the subscription
          delete subscriptions[subscription][uuid];
          ws.terminate();
        }
      });
    });
    checkTimeOut();
  }, timeConsts.ACTIVE_CONNECTION_CHECK_INTERVAL);
};

module.exports = checkTimeOut;
