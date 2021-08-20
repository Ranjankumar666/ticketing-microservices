import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HTTPError, bodyChecker } from '@rktickets2000/common';

const router = Router();

const validators = [
	body('password')
		.trim()
		.notEmpty()
		.withMessage('Password must be valid string'),
	body('email')
		.isEmail()
		.normalizeEmail()
		.withMessage('Must be a valid email'),
];

router.post(
	'/api/users/signin',
	validators,
	bodyChecker,
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};
		try {
			const user = await User.findOne({ email });

			if (!user) {
				throw new HTTPError(400, 'Invalid Email Or Password');
			}

			const isValid = await bcrypt.compare(password, user.password);

			if (!isValid) {
				throw new HTTPError(400, 'Invalid Email Or Password');
			}

			const token = jwt.sign(
				{ email: user.email, id: user._id },
				process.env.JWT_KEY!
			);
			req.session = {
				jwt: token,
			};

			res.status(200).json(user);
		} catch (err) {
			next(err);
		}
	}
);

// export { router as currentuserRouter };
export default router;
