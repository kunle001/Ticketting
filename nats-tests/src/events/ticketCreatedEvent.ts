import { Subjects } from "./subjects";

export interface TicketCreatedEVent {
  subject: Subjects.TicketCreted;
  data: {
    id: string;
    title: string;
    price: number
  }
}