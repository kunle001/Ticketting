import { ExpirationCompleteEvent, Listener, NotFoundError, OrderStatus, Subjects } from "@kunleticket/common";
import { queGroupName } from "./queGroupname";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queGroupName = queGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {

    const order = await Order.findById(data.orderId).populate('ticket')

    if (!order) throw new NotFoundError('order not found')

    order.set({
      status: OrderStatus.Cancelled
    })

    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    })
    msg.ack();
  }
}