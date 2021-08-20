import app from "./app";
import mongoose from "mongoose";
const port = process.env.PORT || 4000;
import natsClient from "./nats-client";
import {
    ExpirationCompleteListener,
    TicketCreatedListner,
    TicketUpdatedListner,
    PaymentCreatedListener,
} from "./events/listeners";

const start = async () => {
    console.log("Starting the Orders service");
    await mongoose.connect(process.env.DB_URL!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    // connect to nats server
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

    // Event listeners for data synchronisation
    new TicketCreatedListner(natsClient.client).listen();
    new TicketUpdatedListner(natsClient.client).listen();
    new ExpirationCompleteListener(natsClient.client).listen();
    new PaymentCreatedListener(natsClient.client).listen();

    app.listen(port, () => {
        console.log("Orders server started at", port);
    });
};

start().catch((err) => {
    console.log(err.message);
});
