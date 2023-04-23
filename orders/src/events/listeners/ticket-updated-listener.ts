import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent, NotFoundError } from "@kunleticket/common";
import { Ticket } from "../../model/ticket";
import { queGroupName } from "./queGroupname";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
  subject: Subjects.ticketUpdated = Subjects.ticketUpdated
  queGroupName = queGroupName

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // console.log(data)
    const ticket = await Ticket.findByEvent(data)
    if (!ticket) throw new NotFoundError('ticket is not found')
    const { title, price, version } = data

    ticket.set({
      title, price, version
    })

    await ticket.save();

    msg.ack()

  }
}