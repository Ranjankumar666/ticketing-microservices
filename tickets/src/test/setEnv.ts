process.env.JWT_KEY = 'hfhgjhfghjhjhg';
process.env.SALT_ROUNDS = '10';
process.env.DB_URL = 'dfhdfsjbhlkfg';
process.env.NATS_CLUSTER_ID = 'ticketing';
process.env.NATS_URL = 'hjfgsaofhga';
process.env.NATS_CLIENT_ID = 'jhashdfvafg';

declare global {
	namespace NodeJS {
		interface Global {
			signin(): Promise<string[]>;
		}
	}
}

// import app from '../app';
// import request from 'supertest';
import jwt from 'jsonwebtoken';

global.signin = (id = 'hjdhfddfgsd') => {
	const creds = {
		id,
		email: 'dummy@email.com',
	};
	// const response = await request(app).post('/api/users/signup').send(creds);

	const token = jwt.sign(creds, process.env.JWT_KEY!);
	const session = JSON.stringify({ jwt: token });
	const sessionBase64 = Buffer.from(session).toString('base64');

	return [`express:sess=${sessionBase64}`];
};
