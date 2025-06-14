import { Listener, Subjects } from '@my-micro-service/common';
import { OrderCanclledEvent } from '@my-micro-service/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-listener';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCanclledEvent> {
  readonly subject  = Subjects.OrderCanclled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCanclledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}
