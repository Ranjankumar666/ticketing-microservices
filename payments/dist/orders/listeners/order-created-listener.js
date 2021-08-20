"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@rktickets2000/common");
// import { Order } from "../../models";
const queue_group_name_1 = __importDefault(require("./queue-group-name"));
class OrderCreatedListner extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.queueGroupName = queue_group_name_1.default;
        this.subject = common_1.Subjects.OrderCreated;
    }
    async onMessage(data, msg) {
        console.log(data);
        // Order.add({
        //     id: data.id,
        //     status: data.status,
        //     price: data.ticket.price,
        //     version: data.version,
        //     userId: data.userId,
        // });
        msg.ack();
    }
}
exports.default = OrderCreatedListner;
