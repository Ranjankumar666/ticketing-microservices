import { Schema, model, Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttr {
    stripeId: string;
    orderId: string;
}

interface PaymentDoc extends Document {
    orderId: string;
    stripeId: string;
}

interface PaymentModel extends Model<PaymentDoc> {
    add(attr: PaymentAttr): PaymentDoc;
    version: number;
}

const paymentSchema = new Schema<PaymentDoc, PaymentModel>(
    {
        orderId: {
            type: String,
            required: true,
        },
        stripeId: {
            type: String,
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

paymentSchema.statics.add = (attr: PaymentAttr) => {
    return new Payment(attr);
};
//@ts-ignore
paymentSchema.plugin(updateIfCurrentPlugin);

const Payment = model<PaymentDoc, PaymentModel>("Payment", paymentSchema);
export default Payment;
