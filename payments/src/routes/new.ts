import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/orders';
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, RequireAuth, validateRequest } from '@my-micro-service/common';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments',
    RequireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) throw new NotFoundError();

        if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

        if (order.status === OrderStatus.Cancelled) throw new BadRequestError('Cannot pay for Cancelled order');

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token,
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });

        await payment.save();
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stipeId: payment.stripeId,
        });

        res.status(201).send({id: payment.id});
    }
);

export { router as createChargeRouter };

