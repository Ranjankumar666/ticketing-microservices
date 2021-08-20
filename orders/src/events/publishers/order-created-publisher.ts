import { Publisher, Subjects, OrderCreatedEvent } from '@rktickets2000/common';

export default class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
