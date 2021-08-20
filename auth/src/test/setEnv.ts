process.env.JWT_KEY = "hfhgjhfghjhjhg";
process.env.SALT_ROUNDS = "10";
process.env.DB_URL = "test db url";

import app from "../app";
import request from "supertest";

declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise<string[]>;
        }
    }
}

global.signin = async () => {
    const creds = {
        email: "dummy@email.com",
        password: "12345678",
    };
    const response = await request(app).post("/api/users/signup").send(creds);

    return response.get("Set-Cookie");
};
