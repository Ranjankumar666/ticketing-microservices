import { OrderCreatedEvent, Listener, Subjects } from "@rktickets2000/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";
import queueGroupName from "./queue-group-name";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        console.log("Order created");
        const order = Order.add({
            id: data.id,
            status: data.status,
            price: data.ticket.price,
            version: data.version,
            userId: data.userId,
        });

        await order.save();

        msg.ack();
    }
}
