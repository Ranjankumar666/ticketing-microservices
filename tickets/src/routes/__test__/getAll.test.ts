import request from 'supertest';
import app from '../../app';

const createTicket = () =>
	request(app).post('/api/tickets').set('Cookie', global.signin()).send({
		title: 'Metallica San Diego',
		price: '2.00',
	});

it('should get all the tickets', async () => {
	await createTicket();
	const { body } = await request(app).get('/api/tickets').expect(200);

	expect(body).toHaveLength(1);
});
