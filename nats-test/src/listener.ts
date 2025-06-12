import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString(), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log("listener is ready");

    stan.on('close', () => {
        process.exit();
    });

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-service');


    const subscription = stan.subscribe(
        'ticket:created',
        'queue-group-name',
        options
    );

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();
        if (typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }

        msg.ack();
    });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
