import mongoos from "mongoose";
import { OrderStatus } from "@my-micro-service/common";
import { TicketDocument } from "./ticket";

interface OrderAttributes {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
}

interface OrderDocument extends mongoos.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDocument;
    version: number;
}

interface OrderModel extends mongoos.Model<OrderDocument> {
    build(attribute: OrderAttributes): OrderDocument;
}

const OrderSchema = new mongoos.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoos.Schema.Types.Date
    },
    ticket: {
        type: mongoos.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
}
);

OrderSchema.statics.build = (attributes: OrderAttributes) => {
    return new Order(attributes);
}

const Order = mongoos.model<OrderDocument, OrderModel>('Order', OrderSchema);
export { Order };