import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@my-micro-service/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orders";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName: string = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) throw new Error('Order not defined');

        if (order.status === OrderStatus.Complete) return msg.ack();

        order.set({
            status: OrderStatus.Cancelled,
        });

        await order.save();

        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            },
        });
    }
};