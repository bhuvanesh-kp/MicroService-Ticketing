import { Subjects, Publisher, ExpirationCompleteEvent } from "@my-micro-service/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}