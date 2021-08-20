import { Schema, model, Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// How the Model will look
interface TicketModel extends Model<TicketDocument> {
    add(attrs: TicketAttrs): TicketDocument;
}

// How the document will look
interface TicketDocument extends TicketAttrs, Document {
    version: number;
    orderId?: string;
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
        },
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
            // default: undefined,
        },
    },
    {
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;

                return ret;
            },
        },
    }
);

ticketSchema.set("versionKey", "version");
//@ts-ignore
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.add = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = model<TicketDocument, TicketModel>("Ticket", ticketSchema);

export default Ticket;
