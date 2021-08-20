import {
    Listener,
    OrderStatus,
    PaymentCreatedEvent,
    Subjects,
} from "@rktickets2000/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";
import queueGroupName from "./queue-group-name";

export default class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.set("status", OrderStatus.Complete);
        await order.save();

        msg.ack();
    }
}
