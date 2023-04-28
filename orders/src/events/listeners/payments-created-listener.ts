import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@kunleticket/common";
import { queGroupName } from './queGroupname'
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queGroupName = queGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {

    const order = await Order.findById(data.orderId);

    if (!order) throw new Error('order is not found to update the payment');

    order.set({
      status: OrderStatus.Complete
    });
    await order.save();

    msg.ack()
  }

}