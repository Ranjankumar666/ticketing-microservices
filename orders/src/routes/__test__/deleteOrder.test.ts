import app from '../../app';
import request from 'supertest';
import { Ticket } from '../../models';
// import { OrderStatus } from '@rktickets2000/common';
import natsClient from '../../nats-client';

const buildTicket = async () => {
	const ticket = Ticket.add({
		price: 50,
		title: 'gig',
	});
	await ticket.save();

	return ticket;
};

it('should send an order of the current user', async () => {
	const ticket = await buildTicket();
	const ticket2 = await buildTicket();

	const userOne = global.signin();
	const userTwo = global.signin('dsfhBJDFGA');

	// create order as first user

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', userOne)
		.send({
			ticketId: ticket.id,
		});

	const { body: order2 } = await request(app)
		.post('/api/orders')
		.set('Cookie', userTwo)
		.send({
			ticketId: ticket2.id,
		});

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', userOne)
		.expect(200);

	await request(app)
		.delete(`/api/orders/${order2.id}`)
		.set('Cookie', userOne)
		.expect(401);
});

it('should emit the event', async () => {
	const ticket = await buildTicket();

	const userOne = global.signin();

	// create order as first user

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', userOne)
		.send({
			ticketId: ticket.id,
		});

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', userOne)
		.expect(200);

	expect(natsClient.client.publish).toHaveBeenCalled();
});
