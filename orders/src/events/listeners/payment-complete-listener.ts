import { Subjects, Listener, PaymentCreatedEvent,OrderStatus } from "@my-micro-service/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) throw new Error('Order not found');

        order.set({
            status: OrderStatus.Complete,
        });
        await order.save();

        msg.ack();
    }
}