import {
    Publisher,
    ExpirationCompleteEvent,
    Subjects,
} from "@rktickets2000/common";

export default class OrderExpirationPublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
