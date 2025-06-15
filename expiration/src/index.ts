import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listener/order-created-listener";

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID not provided");

  if (!process.env.NATS_URL) throw new Error("NATS_URL not provided");

  if (!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID not provided");

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID, 
      process.env.NATS_CLIENT_ID, 
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  }
  catch (err) {
    console.error(err);
  }
};

start();


