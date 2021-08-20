import request from 'supertest';
import app from '../../app';

const creds = {
	email: 'dummy@email.com',
	password: '12345678',
};

it('should signout logged in user', async () => {
	await request(app).post('/api/users/signup').send(creds);

	return request(app).post('/api/users/signout').expect(200);
});
