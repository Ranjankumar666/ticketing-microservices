import { Listener, Subjects, OrderCreatedEvent } from "@rktickets2000/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from ".";
import expirationQueue from "../../queue/expiration-queue";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        console.log("Received request for order");
        console.log("Delay of", delay, "Regsitered");

        await expirationQueue.add(
            {
                orderId: data.id,
            },
            {
                delay,
            }
        );

        msg.ack();
    }
}
