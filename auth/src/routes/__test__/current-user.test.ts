import request from 'supertest';
import app from '../../app';

// const creds = {
// 	email: 'dummy@email.com',
// 	password: '12345678',
// };

it('should return the details of the current user', async () => {
	const cookie = await global.signin();
	return request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.expect((res) => {
			expect(res.body.currentUser).toBeTruthy();
			expect(res.body.currentUser).toHaveProperty('email');
		});
});

it('should return null for not logged in user', async () => {
	return request(app)
		.get('/api/users/currentuser')
		.expect((res) => {
			expect(res.body.currentUser).toBeFalsy();
		});
});
