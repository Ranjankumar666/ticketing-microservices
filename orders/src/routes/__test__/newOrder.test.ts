import request from 'supertest';
import app from '../../app';
import natsClient from '../../nats-client';
import mongoose from 'mongoose';
import { Ticket } from '../../models';

it('throw an error if the ticket doesnt exits', async () => {
	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId: mongoose.Types.ObjectId(),
		})
		.expect(404);
});
it('returns an error if ticket is reserved', async () => {
	const ticket = await Ticket.create({
		title: 'Metallica gig',
		price: 10,
	});

	await request(app).post('/api/orders').set('Cookie', global.signin()).send({
		ticketId: ticket._id,
	});

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId: ticket._id,
		})
		.expect(400);
});
it('creates an order', async () => {
	const ticket = await Ticket.create({
		title: 'Metallica gig',
		price: 10,
	});

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId: ticket._id,
		})
		.expect(201);
});

it('it should emit an event after saving', async () => {
	const ticket = await Ticket.create({
		title: 'Metallica gig',
		price: 10,
	});

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId: ticket._id,
		})
		.expect(201);

	expect(natsClient.client.publish).toHaveBeenCalled();
});
