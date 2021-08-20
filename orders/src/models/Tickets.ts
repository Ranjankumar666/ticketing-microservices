import { OrderStatus } from "@rktickets2000/common";
import { Schema, model, Model, Document } from "mongoose";
import Order from "./Orders";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttr {
    // userId: string;
    title: string;
    // ticketId: string;
    price: number;
    // expiresAt?: Date;
}

export interface TicketDocument extends TicketAttr, Document {
    isReserved(): Promise<boolean>;
    version: number;
}

interface TicketModel extends Model<TicketDocument> {
    add(attr: TicketAttr, customId?: string | undefined): TicketDocument;
    findByEvent(data: {
        id: string;
        version: number;
    }): Promise<TicketDocument | null>;
}

const ticketSchema = new Schema<TicketDocument, TicketModel>(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
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

ticketSchema.set("versionKey", "version");
//@ts-ignore
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.methods.isReserved = async function () {
    return !!(await Order.findOne({
        ticket: this,
        status: {
            $ne: OrderStatus.Cancelled,
        },
    }));
};

ticketSchema.statics.add = (
    attrs: TicketAttr,
    customId?: string | undefined
) => {
    if (customId) {
        return new Ticket({
            _id: customId,
            ...attrs,
        });
    }
    return new Ticket(attrs);
};

ticketSchema.statics.findByEvent = async (data: {
    id: string;
    version: number;
}) => {
    const ticket = await Ticket.findOne({
        _id: data.id,
        version: data.version - 1,
    });

    return ticket;
};
const Ticket = model<TicketDocument, TicketModel>("Ticket", ticketSchema);

export default Ticket;
