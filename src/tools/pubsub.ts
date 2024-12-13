import { Session, Channel, createChannel } from "better-sse";

// const pubsub = new PubSub();

// setInterval(() => {
//         pubsub.publish("Hello there!", "ping");
// }, 1000);

// app.get("/sse", async (req, res) => {
//         const session = await createSession(req, res);

//         pubsub.subscribe(session, "ping");
// });

class PubSub {
  private events = new Map<string, Channel>();

  subscribe(session: Session, event: string): void {
    if (!this.events.has(event)) {
      const newChannel = createChannel();

      this.events.set(event, newChannel);

      // Clean up channel if no more subscribers
      newChannel.on("session-deregistered", () => {
        if (newChannel.sessionCount === 0) {
          this.events.delete(event);
        }
      });
    }

    const channel = this.events.get(event) as Channel;

    channel.register(session);
    console.log("List of Registered: ", this.events.keys());
  }

  unsubscribe(session: Session, event: string): void {
    const channel = this.events.get(event);

    if (channel) {
      channel.deregister(session);
    }
  }

  publish(data: unknown, event: string): void {
    const channel = this.events.get(event);

    if (channel) {
      channel.broadcast(data, event);
    }
  }

  getSubscriptions(): IterableIterator<string> {
    return this.events.keys();
  }
}

export { PubSub };
