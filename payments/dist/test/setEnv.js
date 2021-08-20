"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.JWT_KEY = 'hfhgjhfghjhjhg';
process.env.SALT_ROUNDS = '10';
process.env.DB_URL = 'dfhdfsjbhlkfg';
process.env.NATS_CLUSTER_ID = 'ticketing';
process.env.NATS_URL = 'hjfgsaofhga';
process.env.NATS_CLIENT_ID = 'jhashdfvafg';
// import app from '../app';
// import request from 'supertest';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
global.signin = (id = 'hjdhfddfgsd') => {
    const creds = {
        id,
        email: 'dummy@email.com',
    };
    // const response = await request(app).post('/api/users/signup').send(creds);
    const token = jsonwebtoken_1.default.sign(creds, process.env.JWT_KEY);
    const session = JSON.stringify({ jwt: token });
    const sessionBase64 = Buffer.from(session).toString('base64');
    return [`express:sess=${sessionBase64}`];
};
