import request from 'supertest';
import app from '../../app';
import natsClient from '../../nats-client';

it('should throw 401 error', async () => {
	await request(app)
		.post('/api/tickets')
		.send({
			title: 'Metallica tshirt',
			price: '2.00',
		})
		.expect(401);
});

it('should throw error for invalid title', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: '1',
			price: '2.00',
		})
		.expect(400);
});

it('should throw error for invalid price', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: '1',
			price: 'mango',
		})
		.expect(400);
});

it('should create a new ticket', async () => {
	const { body } = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'Metallica San Diego',
			price: '2.00',
		})
		.expect(201);

	expect(body).toHaveProperty('title');
	expect(body).toHaveProperty('price');
});

it('should publish an event', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'Metallica San Diego',
			price: '2.00',
		})
		.expect(201);

	expect(natsClient.client.publish).toHaveBeenCalled();
});
