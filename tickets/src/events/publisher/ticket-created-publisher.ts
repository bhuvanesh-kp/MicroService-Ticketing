import { Publisher, Subjects, TicketCreatedEvent } from "@my-micro-service/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}