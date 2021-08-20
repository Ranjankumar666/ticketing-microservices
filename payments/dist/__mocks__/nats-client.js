"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    client: {
        publish: jest
            .fn()
            .mockImplementation((_subject, _data, callback) => {
            callback();
        }),
    },
};
