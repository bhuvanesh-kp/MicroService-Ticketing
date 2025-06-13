import { Publisher,OrderCreatedEvent,Subjects } from "@my-micro-service/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
}