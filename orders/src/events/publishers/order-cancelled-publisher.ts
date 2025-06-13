import { Publisher,OrderCanclledEvent,Subjects } from "@my-micro-service/common";

export class OrderCancelledPublisher extends Publisher<OrderCanclledEvent>{
    readonly subject = Subjects.OrderCanclled;
}