import { Publisher, OrderCancelledEvent, Subjects } from "@kunleticket/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
};

