import express, { Request, Response } from "express";
import { Order } from "../models/orders";
import { NotAuthorizedError, NotFoundError, OrderStatus } from "@my-micro-service/common";
import { RequireAuth } from "@my-micro-service/common";

const router = express.Router();

router.delete('/api/orders:orderId', RequireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
});

export { router as deleteOrderRouter };