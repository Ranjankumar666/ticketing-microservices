import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';

it('should throw error for invalid ticket id', async () => {
	const id = mongoose.Types.ObjectId().toHexString();

	await request(app).get(`/api/tickets/${id}`).expect(404);
});

it('should have success for valid ticket id', async () => {
	const { body } = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'Metallica San Diego',
			price: '2.00',
		});

	await request(app).get(`/api/tickets/${body.id}`).expect(200);
});
