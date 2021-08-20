import { TicketCreatedEvent } from '@rktickets2000/common';
import { TicketCreatedListner } from '..';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import natsClient from '../../../nats-client';
import { Ticket } from '../../../models';

const listenerSetUp = () => {
	const listener = new TicketCreatedListner(natsClient.client);

	const data: TicketCreatedEvent['data'] = {
		id: mongoose.Types.ObjectId().toHexString(),
		price: 50.0,
		title: 'Slayer, Bay Area,  San Francisco',
		userId: mongoose.Types.ObjectId().toHexString(),
		version: 0,
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

it('should save a ticket document when an ticket:created event happens', async () => {
	const { listener, data, msg } = listenerSetUp();

	await listener.onMessage(data, msg);
	const savedTicket = await Ticket.findById(data.id);

	expect(savedTicket.id).toEqual(data.id);
});

it('should acknowlegde event after asving', async () => {
	const { listener, data, msg } = listenerSetUp();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
