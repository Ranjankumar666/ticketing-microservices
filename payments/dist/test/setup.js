"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
let mongo;
jest.mock('../nats-client.ts');
beforeAll(async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    await mongoose_1.default.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
});
beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose_1.default.connection.db.collections();
    for (let collection of collections) {
        collection.deleteMany({});
    }
});
afterAll(async () => {
    await mongo.stop();
    await mongoose_1.default.connection.close();
});
