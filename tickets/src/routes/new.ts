import { requireAuth, bodyChecker, currentUser } from "@rktickets2000/common";
import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { Ticket } from "../models";
import { TicketCreatedPublisher } from "../events/publishers";
import natsClient from "../nats-client";

const router = Router();
const validators = [
    body("title")
        .isLength({ min: 4 })
        .withMessage("Title must be atleast 4 chatacters"),
    body("price")
        .isFloat({
            gt: 0,
        })
        .customSanitizer((value) => {
            return parseFloat(value).toFixed(2);
        })
        .withMessage("Must be greateer than 0"),
];

router.use(currentUser);

router.post(
    "/api/tickets",
    requireAuth,
    validators,
    bodyChecker,
    async (req: Request, res: Response, next: NextFunction) => {
        const { title, price } = req.body as { title: string; price: string };
        try {
            const newTicket = Ticket.add({
                title,
                price: +price,
                userId: req.currentUser?.id!,
            });

            const ticket = await newTicket.save();

            new TicketCreatedPublisher(natsClient.client).publish({
                id: ticket.id,
                userId: ticket.userId,
                price: ticket.price,
                title: ticket.title,
                version: ticket.version,
            });

            res.status(201).json(ticket);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
);

export default router;
