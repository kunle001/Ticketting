import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEVent } from "@kunleticket/common";
import { Ticket } from "../../model/ticket";
import { queGroupName } from "./queGroupname";


export class TicketCreatedListener extends Listener<TicketCreatedEVent>{
  subject: Subjects.TicketCreted = Subjects.TicketCreted;
  queGroupName = queGroupName
  async onMessage(data: TicketCreatedEVent['data'], msg: Message) {
    const { id, title, price } = data

    const ticket = Ticket.build({ id, title, price })

    await ticket.save()

    msg.ack()
  }
}