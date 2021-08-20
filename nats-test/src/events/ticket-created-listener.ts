import { Message } from 'node-nats-streaming';
import { Listener, TicketCreatedEvent, Subjects } from '.';

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
	queueGroupName = 'payments-service';
	onMessage(parsedMessage: TicketCreatedEvent['data'], msg: Message) {
		console.log(parsedMessage.price);
		console.log(parsedMessage.title);

		msg.ack();
	}
}
