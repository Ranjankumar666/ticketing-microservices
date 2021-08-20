import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events';

const stan = nats.connect('ticketing', 'abc', {
	url: 'http://localhost:4222',
});

stan.on('connect', async () => {
	console.log('Publisher Connected to NATS');

	const ticketPublisher = new TicketCreatedPublisher(stan);

	const data = {
		title: 'Metallica , San Diego Gig',
		price: 20,
		id: Buffer.from('mango').toString('hex'),
	};

	const guid1 = await ticketPublisher.publish(data);
	const guid2 = await ticketPublisher.publish({
		...data,
		title: 'Slayer gig',
	});

	console.log(guid1, guid2);
});
