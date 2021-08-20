export default {
	client: {
		publish: jest
			.fn()
			.mockImplementation(
				(_subject: string, _data: string, callback: () => void) => {
					callback();
				}
			),
	},
};
