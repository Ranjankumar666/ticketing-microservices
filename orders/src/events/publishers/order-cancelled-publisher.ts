import {
	Publisher,
	Subjects,
	OrderCancelledEvent,
} from '@rktickets2000/common';

export default class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
