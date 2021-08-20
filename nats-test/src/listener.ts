import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
const client = randomBytes(10).toString('hex');
import { TicketCreatedListener } from './events';

const stan = nats.connect('ticketing', client, {
	url: 'http://localhost:4222',
});

stan.on('connect', () => {
	stan.on('close', () => {
		console.log('Gracefully shutting down');
		process.exit();
	});

	const ticketingClient = new TicketCreatedListener(stan);

	ticketingClient.listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGKILL', () => stan.close());
