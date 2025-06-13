import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, RequireAuth } from "@my-micro-service/common";
import { Order } from "../models/orders";

const router = express.Router();

router.get('/api/orders/:orderId', RequireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

});

export { router as showOrderRouter };