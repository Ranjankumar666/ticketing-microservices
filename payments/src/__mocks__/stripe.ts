interface Options {
    amount: number;
    source: string;
    currency: string;
    description: string;
    [keys: string]: any;
}

interface Charge {
    id: string;
    amount: string;
    currency: string;
}

export const stripe = {
    charges: {
        create: jest.fn((options: Options) => {
            const charge: Charge = {
                id: "dfgujfjk",
                amount: String(options.amount),
                currency: options.currency,
            };
            return Promise.resolve(charge);
        }),
    },
};
