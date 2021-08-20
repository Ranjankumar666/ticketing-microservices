import { Listener, Subjects, TicketCreatedEvent } from "@rktickets2000/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models";
import queueGroupName from "./queue-group-name";

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        try {
            console.log("Received event: Ticket Created");
            const { title, price, id } = data;
            // will create a document with version 0
            const newTicket = Ticket.add(
                {
                    title,
                    price,
                },
                id
            );
            await newTicket.save();

            msg.ack();
        } catch (error) {}
    }
}
