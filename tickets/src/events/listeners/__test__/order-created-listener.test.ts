import { OrderCreatedEvent, OrderStatus } from '@rktickets2000/common';
import { OrderCreatedListener } from '../';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import natsClient from '../../../nats-client';
import { Ticket } from '../../../models';

const listenerSetUp = async () => {
	const listener = new OrderCreatedListener(natsClient.client);
	const ticket = await Ticket.add({
		price: 50.0,
		title: 'James and Harry',
		userId: mongoose.Types.ObjectId().toHexString(),
	}).save();

	const data: OrderCreatedEvent['data'] = {
		expiresAt: new Date().toISOString(),
		id: mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
		userId: mongoose.Types.ObjectId().toHexString(),
		version: 0,
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket };
};
it('should reserve the ticket', async () => {
	const { listener, data, msg, ticket } = await listenerSetUp();

	await listener.onMessage(data, msg);
	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toBeTruthy();
});

it('should publish the update event', async () => {
	const { listener, data, msg } = await listenerSetUp();

	await listener.onMessage(data, msg);

	expect(natsClient.client.publish).toHaveBeenCalled();
});

it('should ack the event', async () => {
	const { listener, data, msg } = await listenerSetUp();
	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();

	const updatedData = JSON.parse(
		(natsClient.client.publish as jest.Mock).mock.calls[0][1]
	);

	expect(updatedData.orderId).toEqual(data.id);
});
