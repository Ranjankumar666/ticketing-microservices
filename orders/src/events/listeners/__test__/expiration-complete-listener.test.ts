// import { ExpirationCompleteEvent } from "@rktickets2000/common";
import ExpirationCompleteListener from "../expiration-complete-listener";
import mongoose from "mongoose";
import natsClient from "../../../nats-client";
import { Order, Ticket } from "../../../models";
import { OrderStatus } from "@rktickets2000/common";
// import { OrderCreatedPublisher } from "../../publishers";

const listenerSetUp = async () => {
    const listener = new ExpirationCompleteListener(natsClient.client);

    const ticket = Ticket.add({
        price: 50.0,
        title: "Slayer, Bay Area,  San Francisco",
    });

    await ticket.save();

    const order = Order.add({
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        status: OrderStatus.Created,
        ticket: ticket.id,
        userId: mongoose.Types.ObjectId().toHexString(),
    });

    await order.save();

    const data = {
        orderId: order.id,
    };
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {
        listener,
        msg,
        data,
    };
};

it("should receive the expiration event", async () => {
    const { data, listener, msg } = await listenerSetUp();

    await listener.onMessage(data, msg);
    const order = await Order.findById(data.orderId);
    expect(order.status).toBe(OrderStatus.Cancelled);
});

it("should ack the expiration event", async () => {
    const { data, listener, msg } = await listenerSetUp();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});
