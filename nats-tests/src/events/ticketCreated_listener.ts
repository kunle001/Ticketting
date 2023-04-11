import { Listener } from "./base_listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEVent } from "./ticketCreatedEvent";
import { Subjects } from "./subjects";

/*
readonly: This access modifier indicates that a property or 
method can only be read and not modified. 
It can be applied to both instance and static properties,
 and it can be initialized either inline or in the constructor.
*/

export class TicketCreatedListener extends Listener<TicketCreatedEVent>{

  /*
  This class is meant for handling a ticket created listener,
  it is meant for listening when a ticket is been created 
  */
  readonly subject: Subjects.TicketCreted = Subjects.TicketCreted;

  queGroupName = 'payments-service';

  onMessage(data: TicketCreatedEVent['data'], msg: Message) {
    console.log('Event data!', data)

    msg.ack();
  };

}