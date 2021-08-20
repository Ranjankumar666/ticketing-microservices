import { Message, Stan } from 'node-nats-streaming';
import Subjects from './subjects';

interface Event {
	subject: Subjects;
	data: any;
}

/**
 * Inorder to make this class generic,
 * a generic of type T that extends Event is used
 */
export default abstract class Listener<T extends Event> {
	abstract subject: T['subject'];
	abstract onMessage(parsedMessage: T['data'], msg: Message): void;
	abstract queueGroupName: string;
	// Stan client can be created from nats.connect()
	private client: Stan;
	protected ackWait = 5 * 1000;

	constructor(client: Stan) {
		this.client = client;
	}

	/**
	 * Client options
	 * @returns {nats.SubscriptionOptions}
	 */
	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setAckWait(this.ackWait)
			.setManualAckMode(true)
			.setDeliverAllAvailable()
			.setDurableName(`${this.queueGroupName}-subscribe`);
	}

	/**
	 * Subscribe to the channel or subject
	 */
	listen() {
		const subscription = this.client.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		subscription.on('message', (msg: Message) => {
			const parsedMessage = this.parseMessage(msg);

			this.onMessage(parsedMessage, msg);
		});
	}

	parseMessage(msg: Message) {
		const data = msg.getData();
		return typeof data === 'string'
			? JSON.parse(data)
			: JSON.parse(data.toString('utf-8'));
	}
}
