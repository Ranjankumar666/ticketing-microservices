import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

const randId = randomBytes(10).toString('hex');

export class Nats {
	private _client?: nats.Stan;

	get client() {
		if (!this._client) {
			throw new Error('Cannot access Nats client before initialization');
		}

		return this._client;
	}

	connect(
		clusterId: string,
		clientId: string = randId,
		options: nats.StanOptions
	): Promise<void> {
		this._client = nats.connect(clusterId, clientId, options);

		return new Promise((resolve, reject) => {
			this.client.on('connect', () => {
				resolve();
			});

			this.client.on('error', (err) => {
				reject(err);
			});
		});
	}
}

const natsClient = new Nats();
export default natsClient;
