import { Listener, OrderCreatedEvent, Subjects } from "@kunleticket/common";
import { queGroupName } from "./que-group-name";
import { Message } from 'node-nats-streaming';
import { expirationQueue } from "../../queues/expiration-que";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queGroupName = queGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    await expirationQueue.add({
      orderId: data.id
    }, {
      delay
    });

    msg.ack()

  }

}