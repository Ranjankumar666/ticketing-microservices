"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = process.env.PORT || 4000;
const nats_client_1 = __importDefault(require("./nats-client"));
const start = async () => {
    await mongoose_1.default.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    await nats_client_1.default.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, {
        url: process.env.NATS_URL,
    });
    nats_client_1.default.client.on("close", () => {
        process.exit();
    });
    process.on("SIGINT", nats_client_1.default.client.close);
    // process.on('SIGKILL', natsClient.client.close);
    app_1.default.listen(port, () => {
        console.log("Tickets server started at", port);
    });
};
start().catch((err) => {
    console.log(err.message);
});
