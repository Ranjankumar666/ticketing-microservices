import Ticket from '../Tickets';

// Optimistic Concurrency control
it('should implement OCC in documents', async () => {
	// make a ticket
	const ticket = Ticket.add({
		price: 50,
		title: 'Elvis Show',
		userId: 'yhuFYFHBRFI',
	});
	// save a ticket
	await ticket.save();
	// fetch it twice
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	// make changes
	firstInstance!.set({
		price: 10,
	});
	secondInstance!.set({
		price: 15,
	});

	// save the first one
	await firstInstance!.save();
	// save the second one and expect an error
	try {
		await secondInstance!.save();
	} catch (error) {
		return;
	}

	throw new Error('Should not been here');
});

it('should increment version number on updates', async () => {
	const ticket = Ticket.add({
		price: 50,
		title: 'Elvis Show',
		userId: 'yhuFYFHBRFI',
	});

	const initial = await ticket.save();

	const fetched = await Ticket.findById(ticket.id);

	fetched!.set({
		price: 16,
	});

	const updated = await fetched!.save();
	expect(updated.version).toEqual(initial.version + 1);
});
