import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@my-micro-service/common";
import { queueGroupName } from "./queue-group-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketCreatedPublisher } from "../publisher/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) throw new Error('ticket not found');

        ticket.set({ orderId: data.id });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        });

        msg.ack();
    }
}