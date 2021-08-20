import {
    requireAuth,
    bodyChecker,
    currentUser,
    HTTPError,
    BadRequestError,
} from "@rktickets2000/common";
import { Router, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import { Order, Ticket } from "../models";
import { OrderStatus } from "@rktickets2000/common";
import natsClient from "../nats-client";
import { OrderCreatedPublisher } from "../events/publishers";

//in miniseconds
const EXPIRATION_TIME = 60;

const router = Router();
const validators = [
    body("ticketId")
        .notEmpty()
        .custom((value: string) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Must be valid ticket id"),
];

router.use(currentUser);

router.post(
    "/api/orders",
    requireAuth,
    validators,
    bodyChecker,
    async (req: Request, res: Response, next: NextFunction) => {
        const { ticketId } = req.body;

        try {
            // find the ticket
            const ticket = await Ticket.findById(ticketId);
            if (!ticket) {
                throw new HTTPError(404, "Ticket not found");
            }
            // is the ticket reserved ?
            const ticketReserved = await ticket.isReserved();

            if (ticketReserved) {
                throw new BadRequestError("Ticket reserved");
            }
            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + EXPIRATION_TIME);
            // create a new order
            const newOrder = Order.add({
                expiresAt: expiration,
                status: OrderStatus.Created,
                ticket: ticket,
                userId: req.currentUser?.id!,
            });

            const order = (await newOrder.save()).populate("ticket");

            //emit order created
            new OrderCreatedPublisher(natsClient.client).publish({
                id: order.id,
                expiresAt: order.expiresAt.toISOString(),
                ticket: {
                    id: order.ticket.id,
                    price: order.ticket.price,
                },
                userId: order.userId,
                status: order.status,
                version: order.version,
            });

            res.status(201).json(order);
        } catch (err) {
            next(err);
        }
    }
);

export default router;
