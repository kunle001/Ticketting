import { Subjects, Publisher, TicketCreatedEVent } from "@kunleticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEVent>{
  subject: Subjects.TicketCreted = Subjects.TicketCreted;
};




