import request from 'supertest';
import app from '../../app';
// import assert from 'assert';
const testUrl = '/api/users/signup';

it('should register user with status 201', async () => {
	return request(app)
		.post(testUrl)
		.send({
			email: 'typhonazazel@gmail.com',
			password: '12345678',
		})
		.expect(201);
});

it('should throw 400 error for invalid email', async () => {
	return request(app)
		.post(testUrl)
		.send({
			email: 'dhfhfgdfgh',
			password: '123456789',
		})
		.expect(400);
});

it('should throw 400 error for invalid password', async () => {
	return request(app)
		.post(testUrl)
		.send({
			email: 'typhonazazel@gmail.com',
			password: '123',
		})
		.expect(400);
});

it('should throw 400 error for empty credentials', async () => {
	return request(app)
		.post(testUrl)
		.send({
			email: '',
			password: '',
		})
		.expect(400);
});

it('should throw 400 error for non-unique email', async () => {
	await request(app).post(testUrl).send({
		email: 'typhonazazel@gmail.com',
		password: '123456789',
	});

	return request(app)
		.post(testUrl)
		.send({
			email: 'typhonazazel@gmail.com',
			password: '123456789',
		})
		.expect(400);
});

it('should have user id and email after successfully request', async () => {
	return request(app)
		.post(testUrl)
		.send({
			email: 'typhonazazel@gmail.com',
			password: '12345678',
		})
		.expect(201)
		.expect('Content-Type', /json/)
		.expect((res) => {
			expect(res.body.id).toBeTruthy();
			expect(res.body.email).toEqual('typhonazazel@gmail.com');
		});
});

it('should have Set-Cookie Header', async () => {
	return request(app)
		.post(testUrl)
		.send({
			email: 'typhonazazel@gmail.com',
			password: '123456789',
		})
		.expect(201)
		.expect((res) => {
			expect(res.headers).toHaveProperty('set-cookie');
		});
});
