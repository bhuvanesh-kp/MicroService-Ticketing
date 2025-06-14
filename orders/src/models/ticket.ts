import mongoose from "mongoose";
import { Order } from "./orders";
import { OrderStatus } from "@my-micro-service/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttributes {
    id: string;
    title: string;
    price: number;
}

export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attributes: TicketAttributes): TicketDocument;
    findByEvent(e : {id:string, version: number}) : Promise<TicketDocument | null>
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

/* ticketSchema.pre('save', function (done) {
    this.$where = {
        version: this.get('version') - 1
    };

    done();
}) */

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket({
        _id: attributes.id,
        title: attributes.title,
        price: attributes.price
    });
};

ticketSchema.statics.build = (e : {id: string,version: number}) => {
    return Ticket.findOne({
        _id: e.id,
        version: e.version - 1
    });
};

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);
export { Ticket };