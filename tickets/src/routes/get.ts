import { HTTPError } from "@rktickets2000/common";
import { NextFunction, Router, Request, Response } from "express";
import { Ticket } from "../models";

const router = Router();

router.get(
    "/api/tickets/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string };

            const ticket = await Ticket.findById(id);

            if (!ticket) {
                throw new HTTPError(404, "Ticket Not Found");
            }

            res.json(ticket);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
