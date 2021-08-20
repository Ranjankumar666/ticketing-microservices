import { Router, Request, Response, NextFunction } from "express";
import {
    requireAuth,
    bodyChecker,
    NotFoundError,
    NotAuthroizedError,
    OrderStatus,
    BadRequestError,
    currentUser,
} from "@rktickets2000/common";
import { body } from "express-validator";
import { Order, Payment } from "../models";
import { stripe } from "../stripe";
import PaymentCreatedPublisher from "../events/publishers/payment-created-publisher";
import natsClient from "../nats-client";

const router = Router();
router.use(currentUser);

router.post(
    "/api/payments/",
    requireAuth,
    [body("token").notEmpty(), body("orderId").notEmpty()],
    bodyChecker,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, orderId } = req.body;
            const order = await Order.findById(orderId);

            if (!order) {
                throw new NotFoundError("Order Not Found");
            }
            if (req.currentUser?.id !== order.userId) {
                throw new NotAuthroizedError();
            }

            if (order.status === OrderStatus.Cancelled) {
                throw new BadRequestError("Order already cancelled");
            }

            const charged = await stripe.charges.create({
                amount: order.price * 100,
                source: token,
                currency: "inr",
                description: "This is a test for payment",
            });

            const payment = await Payment.add({
                stripeId: charged.id,
                orderId: orderId,
            }).save();
            // Order charged event

            await new PaymentCreatedPublisher(natsClient.client).publish({
                orderId,
                stripeId: charged.id,
                id: payment._id,
            });

            console.log("Payment Done for", orderId);

            res.status(201).json({
                id: charged.id,
                amount: charged.amount,
                currency: charged.currency,
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }
);

export default router;
