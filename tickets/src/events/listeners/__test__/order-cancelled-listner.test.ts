import { OrderCancelledEvent } from '@rktickets2000/common';
import { OrderCancelledListener } from '../';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import natsClient from '../../../nats-client';
import { Ticket } from '../../../models';

const listenerSetUp = async () => {
	const listener = new OrderCancelledListener(natsClient.client);
	const ticket = await Ticket.add({
		price: 50.0,
		title: 'James and Harry',
		userId: mongoose.Types.ObjectId().toHexString(),
	}).save();

	const data: OrderCancelledEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		ticket: {
			id: ticket.id,
		},
		version: 0,
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket };
};
it('should cancel the ticket order', async () => {
	const { listener, data, msg, ticket } = await listenerSetUp();

	await listener.onMessage(data, msg);
	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toBeFalsy();
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

	expect(updatedData.orderId).toBeUndefined();
});
