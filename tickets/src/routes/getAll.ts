import { NextFunction, Router, Request, Response } from "express";
import { Ticket } from "../models";

const router = Router();

router.get(
    "/api/tickets",
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const tickets = await Ticket.find({
                orderId: undefined,
            });

            res.json(tickets);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
