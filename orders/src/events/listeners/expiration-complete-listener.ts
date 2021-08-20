import {
    Listener,
    Subjects,
    ExpirationCompleteEvent,
    OrderStatus,
} from "@rktickets2000/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";
import { OrderCancelledPublisher } from "../publishers";
import queueGroupName from "./queue-group-name";

export default class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        console.log("Received the order to cancel");
        const order = await Order.findById(data.orderId).populate("ticket");

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === OrderStatus.Complete) {
            console.log("Received a completed order to cancel");
            msg.ack();
            return;
        }

        order.set("status", OrderStatus.Cancelled);
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id,
            },
            version: order.version,
        });

        msg.ack();
    }
}
