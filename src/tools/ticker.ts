import { createChannel } from "better-sse";
import { CustomEvent } from "./custom-event";

/**
 * Create a channel that allows you to broadcast messages
 * to multiple sessions at once.
 */
const ticker = createChannel();

/**
 * Count upwards and broadcast the count to every client once per second.
 */
let count = 0;

setInterval(() => {
  ticker.broadcast(count++, CustomEvent.TICKER);
}, 1000);

/**
 * Keep track of how many clients are subscribed to the channel, and
 * inform existing clients of the count every time a session
 * is registered and deregistered.
 */
const broadcastSessionCount = () => {
  console.log("Broadcasting session count:", ticker.sessionCount);
  ticker.broadcast(ticker.sessionCount, CustomEvent.SESSION_COUNT);
};
ticker
  .on("session-registered", broadcastSessionCount)
  .on("session-deregistered", broadcastSessionCount);

export { ticker };
