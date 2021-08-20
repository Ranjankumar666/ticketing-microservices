import { Publisher, Subjects, TicketUpdatedEvent } from "@rktickets2000/common";

export default class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
