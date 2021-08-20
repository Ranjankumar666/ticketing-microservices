import { currentUser, requireAuth } from '@rktickets2000/common';
import { NextFunction, Router, Request, Response } from 'express';
import { Order } from '../models';

const router = Router();

router.use(currentUser);

router.get(
	'/api/orders',
	requireAuth,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const tickets = await Order.find({
				userId: req.currentUser?.id,
			});

			res.json(tickets);
		} catch (error) {
			next(error);
		}
	}
);

export default router;
