import { Subjects, Publisher, TicketUpdatedEvent } from "@kunleticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.ticketUpdated = Subjects.ticketUpdated;
};