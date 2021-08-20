import request from "supertest";
import app from "../../app";
import { Order } from "../../models";
import mongoose from "mongoose";
import { OrderStatus } from "@rktickets2000/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models";
jest.mock("../../stripe.ts");

const getOrder = async (userId, cancel = false) => {
    const order = Order.add({
        price: 50,
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        status: !cancel ? OrderStatus.Created : OrderStatus.Cancelled,
        version: 0,
    });
    await order.save();

    return order;
};
const token = "tok_mastercard";

it("should throw error invalid order", async () => {
    const userId = "46363475436";
    let cookie = global.signin(userId);
    // const order = await getOrder(userId);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: "jrgfjghfdh",
            orderId: mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it("should throw error when other user pays for the order", async () => {
    const userId = "46363475436";
    let cookie = global.signin(userId);
    const order = await getOrder("hdgsfjfdgnfgj");

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: "jrgfjghfdh",
            orderId: order._id,
        })
        .expect(401);
});

it("should throw bad request error for cancelled order", async () => {
    const userId = "46363475436";
    let cookie = global.signin(userId);
    const order = await getOrder(userId, true);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token: "jrgfjghfdh",
            orderId: order._id,
        })
        .expect(400);
});
it("should charge the payment", async () => {
    const userId = "46363475436";
    let cookie = global.signin(userId);
    const order = await getOrder(userId);

    await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token,
            orderId: order._id,
        })
        .expect(201);

    expect(stripe.charges.create).toHaveBeenCalled();
});

it("should be called with right args", async () => {
    const userId = "46363475436";
    let cookie = global.signin(userId);
    const order = await getOrder(userId);

    await request(app).post("/api/payments").set("Cookie", cookie).send({
        token,
        orderId: order._id,
    });

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.amount).toBe(order.price * 100);
    expect(chargeOptions.source).toBe(token);
    expect(chargeOptions.currency).toBe("inr");
});

it("should register a payment in db", async () => {
    const userId = "46363475436";
    let cookie = global.signin(userId);
    const order = await getOrder(userId);

    const { body } = await request(app)
        .post("/api/payments")
        .set("Cookie", cookie)
        .send({
            token,
            orderId: order._id,
        });

    const stripeId = body.id;
    const payment = await Payment.findOne({
        stripeId,
    });

    expect(payment).toBeTruthy();
});

// it("should not charge the payment for wrong token", async () => {
//     const userId = "46363475436";
//     let cookie = global.signin(userId);
//     const order = await getOrder(userId);

//     await request(app)
//         .post("/api/payments")
//         .set("Cookie", cookie)
//         .send({
//             token: "dfhfvjdfgkf",
//             orderId: order._id,
//         })
//         .expect(500);
//     expect(stripe.charges.create).toHaveBeenCalled();
// });

it("should change the order status", async () => {
    const userId = "46363475436";
    let cookie = global.signin(userId);
    const order = await getOrder(userId);

    await request(app).post("/api/payments").set("Cookie", cookie).send({
        token,
        orderId: order._id,
    });
});
