"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nats = void 0;
const node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
const crypto_1 = require("crypto");
const randId = crypto_1.randomBytes(10).toString('hex');
class Nats {
    get client() {
        if (!this._client) {
            throw new Error('Cannot access Nats client before initialization');
        }
        return this._client;
    }
    connect(clusterId, clientId = randId, options) {
        this._client = node_nats_streaming_1.default.connect(clusterId, clientId, options);
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
exports.Nats = Nats;
const natsClient = new Nats();
exports.default = natsClient;
