import { Subjects, Publisher, PaymentCreatedEvent } from "@my-micro-service/common";    

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}