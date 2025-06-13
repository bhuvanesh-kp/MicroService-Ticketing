import { Publisher, Subjects, TicketUpdatedEvent } from "@my-micro-service/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}