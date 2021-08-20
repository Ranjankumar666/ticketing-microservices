import { Router, Response, Request, NextFunction } from 'express';
import { body } from 'express-validator';
import { bodyChecker } from '@rktickets2000/common';
import { User } from '../models';
import jwt from 'jsonwebtoken';

const router = Router();
const validator = [
	body('email')
		.trim()
		.isEmail()
		.normalizeEmail()
		.withMessage('Email must be valid')
		.custom(async (value) => {
			const doesEmailExists = await User.findOne({ email: value });
			if (doesEmailExists) {
				throw new Error('Email already exists');
			}
		}),
	body('password')
		.trim()
		.isLength({ min: 4, max: 30 })
		.withMessage(
			'Password must be atleast 4 characters and maximum 30 characters'
		),
];

router.post(
	'/api/users/signup',
	validator,
	bodyChecker,
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};
		try {
			const newUser = User.add({
				email,
				password,
			});

			const user = await newUser.save();

			const token = jwt.sign(
				{
					id: newUser._id,
					email: newUser.email,
				},
				process.env.JWT_KEY! as string
			);

			req.session = {
				jwt: token,
			};
			res.status(201).json(user);
		} catch (err) {
			console.log(err.message);
			next(err);
		}
	}
);

export default router;
