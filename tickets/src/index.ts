import app from "./app";
import mongoose from "mongoose";
const port = process.env.PORT || 4000;
import natsClient from "./nats-client";
import {
    OrderCancelledListener,
    OrderCreatedListener,
} from "./events/listeners";

const start = async () => {
    console.log("Starting the tickets server");
    await mongoose.connect(process.env.DB_URL!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

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
    new OrderCancelledListener(natsClient.client).listen();
    app.listen(port, () => {
        console.log("Tickets server started at", port);
    });
};

start().catch((err) => {
    console.log(err.message);
});
