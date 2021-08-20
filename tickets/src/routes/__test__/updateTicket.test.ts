import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import natsClient from '../../nats-client';
import { Ticket } from '../../models';

const createTicket = () =>
	request(app).post('/api/tickets').set('Cookie', global.signin()).send({
		title: 'Metallica San Diego',
		price: '2.00',
	});

it('should throw error for invalid users', async () => {
	const { body } = await createTicket();
	await request(app)
		.put(`/api/tickets/${body.id}`)
		.send({
			title: 'Sla',
			price: '10',
		})
		.expect(401);
});

it('should throw error for invalid price', async () => {
	const { body } = await createTicket();
	await request(app)
		.put(`/api/tickets/${body.id}`)
		.send({
			title: 'Slayer Gig',
			price: '-10',
		})
		.set('Cookie', global.signin())
		.expect(400);
});

it('should throw error for invalid title', async () => {
	const { body } = await createTicket();
	await request(app)
		.put(`/api/tickets/${body.id}`)
		.send({
			title: 'Sla',
			price: '10',
		})
		.set('Cookie', global.signin())
		.expect(400);
});

it('should throw error for invalid ticket id', async () => {
	const id = mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'Slayer Gig',
			price: '10',
		})
		.set('Cookie', global.signin())
		.expect(404);
});

it('should throw error for not authorised users', async () => {
	const { body } = await createTicket();

	await request(app)
		.put(`/api/tickets/${body.id}`)
		.set('Cookie', global.signin('ujdgdkhfgjofd'))
		.send({
			title: 'Megadeth Tickets',
		})
		.expect(401);
});

it('should allow users who created the ticket to change the ticket', async () => {
	const { body } = await createTicket();

	const response = await request(app)
		.put(`/api/tickets/${body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'Slayer Gig',
			price: 10,
		})
		.expect(200);

	expect(response.body.title).toEqual('Slayer Gig');
	expect(response.body.price).toEqual(10);
});

it('should throw reject edist for reserved tickets', async () => {
	const userId = mongoose.Types.ObjectId().toHexString();
	let ticket = Ticket.add({
		price: 50,
		title: 'Meow Meow',
		userId,
	});

	ticket.set({
		orderId: mongoose.Types.ObjectId().toHexString(),
	});

	ticket = await ticket.save();

	await request(app)
		.put(`/api/tickets/${ticket.id}`)
		.set('Cookie', global.signin(userId))
		.send({
			title: 'Slayer Gig',
			price: 10,
		})
		.expect(400);
});

it('should publish an event', async () => {
	const { body } = await createTicket();

	await request(app)
		.put(`/api/tickets/${body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'Slayer Gig',
			price: 10,
		})
		.expect(200);

	expect(natsClient.client.publish).toHaveBeenCalled();
});
