import { Listener, Subjects, OrderCancelledEvent } from "@rktickets2000/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from ".";
import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "../publishers";

export default class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        console.log("Order cancelled event");
        //find the order
        let ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error("Ticket Not Found");
        }
        // unreserve the ticket for which its cancelled
        ticket.set({ orderId: undefined });

        ticket = await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
        });
        msg.ack();
    }
}
