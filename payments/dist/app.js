"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@rktickets2000/common");
const cookie_session_1 = __importDefault(require("cookie-session"));
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.set("trust proxy", true);
app.use(express_1.default.json());
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(cookie_session_1.default({
    signed: false,
    secure: process.env.NODE_ENV === "production",
}));
app.use("*", () => {
    throw new common_1.HTTPError(404, "Route Not Found");
});
app.use(common_1.errorMiddleware);
if (!process.env.JWT_KEY ||
    !process.env.SALT_ROUNDS ||
    !process.env.DB_URL ||
    !process.env.NATS_CLUSTER_ID ||
    !process.env.NATS_URL ||
    !process.env.NATS_CLIENT_ID) {
    throw new Error("Invalid env");
}
exports.default = app;
