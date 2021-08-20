import { Publisher, Subjects, TicketCreatedEvent } from "@rktickets2000/common";

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
