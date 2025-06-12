import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    const publisher = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 47
        });
    }
    catch (err) {
        console.error(err);
    }
    /* const data = JSON.stringify({
        id: '1234',
        title: "myevent",
        price: 20
    });

    stan.publish('ticket:created', data , () => {
        console.log(data);
    }) */
});