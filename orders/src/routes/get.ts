import { currentUser, NotFoundError, requireAuth } from '@rktickets2000/common';
import { NextFunction, Router, Request, Response } from 'express';
import { Order } from '../models';

const router = Router();

router.use(currentUser);

router.get(
	'/api/orders/:id',
	requireAuth,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params as { id: string };

			const order = await Order.findOne({
				_id: id,
				userId: req.currentUser?.id!,
			});

			if (!order) {
				throw new NotFoundError('Order not found');
			}

			res.json(order);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
