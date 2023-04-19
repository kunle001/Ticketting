import { Publisher, OrderCreatedEvent, Subjects } from "@kunleticket/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated
};

