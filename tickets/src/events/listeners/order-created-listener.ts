import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@kunleticket/common";
import { queGroupName } from "./que-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
// import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queGroupName = queGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving 
    const ticket = await Ticket.findById(data.ticket.id)

    // if no ticket, throw error 
    if (!ticket) throw new Error('ticket not found')

    // Mark ticket as being reserved by setting its orderId property 
    ticket.set({ orderId: data.id })

    // save the ticket 
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      version: ticket.version,
      userId: ticket.userId,
      title: ticket.userId,
      orderId: ticket.orderId
    })

    // ack message
    msg.ack()
  }

}