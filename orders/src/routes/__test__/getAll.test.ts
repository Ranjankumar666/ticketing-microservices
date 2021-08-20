import app from '../../app';
import request from 'supertest';
import { Ticket } from '../../models';

const buildTicket = async () => {
	const ticket = Ticket.add({
		price: 50,
		title: 'gig',
	});
	await ticket.save();

	return ticket;
};

it('should send all orders of the current user', async () => {
	const ticket = await buildTicket();
	const ticket2 = await buildTicket();
	const ticket3 = await buildTicket();

	const userOne = global.signin();
	const userTwo = global.signin('dsfhBJDFGA');

	// create order as first user

	await request(app).post('/api/orders').set('Cookie', userOne).send({
		ticketId: ticket.id,
	});

	await request(app).post('/api/orders').set('Cookie', userTwo).send({
		ticketId: ticket2.id,
	});

	const { body } = await request(app)
		.post('/api/orders')
		.set('Cookie', userTwo)
		.send({
			ticketId: ticket3.id,
		});

	const user1Res = await request(app)
		.get('/api/orders')
		.set('Cookie', userOne)
		.expect(200);
	const user2Res = await request(app)
		.get('/api/orders')
		.set('Cookie', userTwo)
		.expect(200);

	expect(user1Res.body).toHaveLength(1);
	expect(user2Res.body).toHaveLength(2);
	expect(user2Res.body[1].id).toStrictEqual(body.id);
});
