import { Publisher } from "./base_publisher";
import { TicketCreatedEVent } from "./ticketCreatedEvent";
import { Subjects } from "./subjects";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEVent>{
  subject: Subjects.TicketCreted = Subjects.TicketCreted;
}