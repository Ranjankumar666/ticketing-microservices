import { Schema, model, Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
    id: string;
    status: string;
    userId: string;
    price: number;
    version: number;
}

interface OrderDocument extends Document {
    version: number;
    status: string;
    userId: string;
    price: number;
}

interface OrderModel extends Model<OrderDocument> {
    add(attr: OrderAttrs): OrderDocument;
}

const orderSchema = new Schema<OrderDocument, OrderModel>(
    {
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
    },
    {
        toJSON: {
            transform(_doc, ret) {
                const id = ret._id;
                ret.id = id;
                delete ret._id;

                return ret;
            },
        },
        versionKey: "version",
    }
);

orderSchema.statics.add = (attr: OrderAttrs) => {
    return new Order({
        _id: attr.id,
        ...attr,
    });
};
//@ts-ignore
orderSchema.plugin(updateIfCurrentPlugin);

const Order = model<OrderDocument, OrderModel>("Order", orderSchema);

export default Order;
