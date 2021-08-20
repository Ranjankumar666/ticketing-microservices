import express from 'express';
// import 'express-async-errors'
import cookieSession from 'cookie-session';
import { errorMiddleware, HTTPError } from '@rktickets2000/common';
import {
	currentuserRouter,
	signinRouter,
	signoutRouter,
	signupRouter,
} from './routes';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	next();
});
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV === 'production',
	})
);

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', () => {
	throw new HTTPError(404, 'Route Not Found');
});

app.use(errorMiddleware);

if (!process.env.JWT_KEY || !process.env.SALT_ROUNDS || !process.env.DB_URL) {
	throw new Error('Invalid env');
}

export default app;
