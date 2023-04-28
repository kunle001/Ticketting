import { PaymentCreatedEvent, Publisher, Subjects } from "@kunleticket/common";


export class PyamentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}