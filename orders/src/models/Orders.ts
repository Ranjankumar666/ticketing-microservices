import { Schema, model, Document, Model } from "mongoose";
import { OrderStatus } from "@rktickets2000/common";
import { TicketDocument } from "./Tickets";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
    ticket: TicketDocument;
    status: OrderStatus;
    userId: string;
    expiresAt: Date;
}

// How the document will look
interface OrderDocument extends OrderAttrs, Document {
    version: number;
}
// How the Model will look
interface OrderModel extends Model<OrderDocument> {
    add(attrs: OrderAttrs): OrderDocument;
    // ticketReserved(ticket: TicketDocument): Promise<TicketDocument | null>;
}

const orderSchema = new Schema<OrderDocument, OrderModel>(
    {
        ticket: {
            type: Schema.Types.ObjectId,
            ref: "Ticket",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        userId: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                // delete ret.__v;

                return ret;
            },
        },
    }
);

orderSchema.set("versionKey", "version");
//@ts-ignore
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.add = (attrs: OrderAttrs) => {
    return new Order(attrs);
};
// orderSchema.statics.ticketReserved = async (ticket: TicketDocument) => {
// 	return Ticket.findOne({
// 		ticket,
// 		status: {
// 			$ne: OrderStatus.Cancelled,
// 		},
// 	});
// };
orderSchema.pre("find", function () {
    this.populate("ticket");
});
orderSchema.pre("findOne", function () {
    this.populate("ticket");
});

const Order = model<OrderDocument, OrderModel>("Order", orderSchema);

export default Order;
