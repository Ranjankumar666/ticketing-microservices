import {
    Publisher,
    PaymentCreatedEvent,
    Subjects,
} from "@rktickets2000/common";

export default class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
