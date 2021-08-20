import {
	currentUser,
	NotAuthroizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from '@rktickets2000/common';
import { Router, Response, Request, NextFunction } from 'express';
import { OrderCancelledPublisher } from '../events/publishers';
import { Order } from '../models';
import natsClient from '../nats-client';

const router = Router();
router.use(currentUser);

router.delete(
	'/api/orders/:id',
	requireAuth,
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const order = await Order.findById(id).populate('ticket');

			// check whether exists
			if (!order) {
				throw new NotFoundError('Order Not Found');
			}
			// check creator is same order userId
			if (req.currentUser?.id! !== order.userId) {
				throw new NotAuthroizedError();
			}

			//update status
			order.status = OrderStatus.Cancelled;

			const updatedOrder = await order.save();

			await new OrderCancelledPublisher(natsClient.client).publish({
				id: order.id,
				ticket: {
					id: order.ticket.id,
				},
				version: updatedOrder.version,
			});

			res.status(200).json(order);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
