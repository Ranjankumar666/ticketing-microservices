import { Stan } from 'node-nats-streaming';
import Subjects from './subjects';

interface Event {
	subject: Subjects;
	data: any;
}

export default abstract class Publisher<T extends Event> {
	abstract subject: T['subject'];
	private client: Stan;

	constructor(client: Stan) {
		this.client = client;
	}

	publish(data: T['data']): Promise<string> {
		const stringifiedData = JSON.stringify(data, null, 4);

		return new Promise((resolve, reject) => {
			this.client.publish(this.subject, stringifiedData, (err, guid) => {
				if (err) {
					reject(err);
				}

				resolve(guid);
			});
		});
	}
}
