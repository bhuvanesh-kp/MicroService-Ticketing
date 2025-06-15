import { OrderCanclledEvent, Subjects, Listener, OrderStatus } from "@my-micro-service/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCanclledListener extends Listener<OrderCanclledEvent> {
    readonly subject = Subjects.OrderCanclled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCanclledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if (!order) throw new Error('Order not found');

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }
}