import app from '../../app';
import request from 'supertest';

const creds = {
	email: 'dummy@email.com',
	password: '12345678',
};

it('should throw 400 status for non-registerd users', async () => {
	return request(app).post('/api/users/signin').send(creds).expect(400);
});

it('should accept only registered users', async () => {
	await request(app).post('/api/users/signup').send(creds);
	return request(app).post('/api/users/signin').send(creds).expect(200);
});

it('should throw 400 status for wrong password', async () => {
	await request(app).post('/api/users/signup').send(creds);
	return request(app)
		.post('/api/users/signin')
		.send({
			...creds,
			password: '1235',
		})
		.expect(400);
});

it('should have set-cookie header', async () => {
	await request(app).post('/api/users/signup').send(creds);
	return request(app)
		.post('/api/users/signin')
		.send(creds)
		.expect(200)
		.expect((res) => {
			expect(res.headers).toHaveProperty('set-cookie');
		});
});
