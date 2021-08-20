"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const orderSchema = new mongoose_1.Schema({
    status: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
}, {
    toJSON: {
        transform(_doc, ret) {
            const id = ret._id;
            ret.id = id;
            delete ret._id;
            return ret;
        },
    },
    versionKey: "version",
});
orderSchema.statics.add = (attr) => {
    return new Order({
        _id: attr.id,
        ...attr,
    });
};
//@ts-ignore
orderSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
const Order = mongoose_1.model("Order", orderSchema);
exports.default = Order;
