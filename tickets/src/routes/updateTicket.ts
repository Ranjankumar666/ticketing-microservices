import {
    BadRequestError,
    bodyChecker,
    currentUser,
    HTTPError,
    NotAuthroizedError,
    requireAuth,
} from "@rktickets2000/common";
import { Router, Response, Request, NextFunction } from "express";
import { Ticket } from "../models";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers";
import natsClient from "../nats-client";

const router = Router();
const validators = [
    body("title")
        .isLength({ min: 4 })
        .withMessage("Title must be atleast 4 chatacters")
        .optional({ nullable: true }),
    body("price")
        .isFloat({
            gt: 0,
        })
        .withMessage("Must be greateer than 0")
        .customSanitizer((value) => {
            return parseFloat(value).toFixed(2);
        })
        .optional({
            nullable: true,
        }),
];
router.use(currentUser);

router.put(
    "/api/tickets/:id",
    requireAuth,
    validators,
    bodyChecker,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const ticket = await Ticket.findById(id);

            if (!ticket) {
                throw new HTTPError(404, "Ticket Not Found");
            }

            // Check for reservation
            if (ticket.orderId) {
                throw new BadRequestError("Ticket reserved");
            }

            if (ticket.userId !== req.currentUser?.id) {
                throw new NotAuthroizedError();
            }

            ticket.title = req.body.title || ticket.title;
            ticket.price = req.body.price || ticket.price;

            const updatedTicket = await ticket.save();

            new TicketUpdatedPublisher(natsClient.client).publish({
                id: updatedTicket.id,
                title: updatedTicket.title,
                price: updatedTicket.price,
                userId: updatedTicket.userId,
                version: updatedTicket.version,
            });

            res.json(updatedTicket);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
