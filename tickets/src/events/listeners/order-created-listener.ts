import { Listener, Subjects, OrderCreatedEvent } from "@rktickets2000/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from ".";
import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "../publishers";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        console.log("Order Created Event");
        //find the ticket
        let ticket = await Ticket.findById(data.ticket.id);
        //no ticket? throw error
        if (!ticket) {
            throw new Error("Ticket Not Found");
        }
        // reserve the ticket for which its is created for
        ticket.set({
            orderId: data.id,
        });

        ticket = await ticket.save();
        console.log(ticket);
        //publish the update

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId,
            price: ticket.price,
        });
        // acknowledge
        msg.ack();
    }
}
