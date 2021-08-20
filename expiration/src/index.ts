import { OrderCreatedListener } from "./events/listeners";
import natsClient from "./nats-client";

if (
    !process.env.NATS_CLUSTER_ID ||
    !process.env.NATS_URL ||
    !process.env.NATS_CLIENT_ID
) {
    throw new Error("Invalid env");
}

const start = async () => {
    await natsClient.connect(
        process.env.NATS_CLUSTER_ID!,
        process.env.NATS_CLIENT_ID!,
        {
            url: process.env.NATS_URL!,
        }
    );

    natsClient.client.on("close", () => {
        process.exit();
    });

    process.on("SIGINT", natsClient.client.close);
    // process.on('SIGKILL', natsClient.client.close);

    new OrderCreatedListener(natsClient.client).listen();
};

start().catch((err) => {
    console.log(err.message);
});
