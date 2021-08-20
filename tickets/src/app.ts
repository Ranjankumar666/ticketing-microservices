import { errorMiddleware, HTTPError } from "@rktickets2000/common";
import cookieSession from "cookie-session";
import express from "express";
import {
    createNewTicketRouter,
    getTicket,
    getTickets,
    updateTicket,
} from "./routes/";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    next();
});
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV === "production",
    })
);

app.use(getTickets);
app.use(getTicket);
app.use(createNewTicketRouter);
app.use(updateTicket);

app.use("*", () => {
    throw new HTTPError(404, "Route Not Found");
});

app.use(errorMiddleware);

if (
    !process.env.JWT_KEY ||
    !process.env.SALT_ROUNDS ||
    !process.env.DB_URL ||
    !process.env.NATS_CLUSTER_ID ||
    !process.env.NATS_URL ||
    !process.env.NATS_CLIENT_ID
) {
    throw new Error("Invalid env");
}
export default app;
