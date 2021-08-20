import { Subjects, Listener, TicketUpdatedEvent } from '@rktickets2000/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models';
import queueGroupName from './queue-group-name';

export default class TicketUpdatedListner extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;
	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		// try {
		console.log('Received event: Ticket Updated');
		const { price, title, id, version } = data;
		// apply update to prior version only
		const ticket = await Ticket.findByEvent({
			id,
			version,
		});

		if (!ticket) {
			throw new Error('Ticket Not Found');
		}

		ticket.set({
			title,
			price,
		});

		await ticket.save();
		msg.ack();
		// } catch (error) {}
	}
}
