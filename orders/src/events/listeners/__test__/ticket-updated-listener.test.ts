import { TicketUpdatedEvent } from '@rktickets2000/common';
import { TicketUpdatedListner } from '..';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import natsClient from '../../../nats-client';
import { Ticket } from '../../../models';

const listenerSetUp = () => {
	const listener = new TicketUpdatedListner(natsClient.client);

	const data: TicketUpdatedEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		price: 50.0,
		title: 'Slayer, Bay Area,  San Francisco',
		userId: mongoose.Types.ObjectId().toHexString(),
		version: 1,
	};

	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return {
		listener,
		msg,
		data,
	};
};

it('should throw error for not proper versioning', async () => {
	const { listener, data, msg } = listenerSetUp();

	expect(listener.onMessage(data, msg)).rejects.toEqual(
		new Error('Ticket Not Found')
	);
});

it('should save ticket for proper versioning', async () => {
	const { listener, data, msg } = listenerSetUp();

	const ticket = await Ticket.add({
		price: 50,
		title: 'Slayer',
	}).save();

	await listener.onMessage(
		{
			...data,
			id: ticket.id,
		},
		msg
	);

	const checkUpdate = await Ticket.findById(ticket.id);
	expect(checkUpdate.version).toEqual(1);
});

it('should acknowlegde event after asving', async () => {
	const { listener, data, msg } = listenerSetUp();

	const ticket = await Ticket.add({
		price: 50,
		title: 'Slayer',
	}).save();

	await listener.onMessage(
		{
			...data,
			id: ticket.id,
		},
		msg
	);

	expect(msg.ack).toHaveBeenCalled();
});
