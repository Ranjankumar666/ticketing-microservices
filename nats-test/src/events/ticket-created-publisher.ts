import { TicketCreatedEvent, Publisher, Subjects } from '.';

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
