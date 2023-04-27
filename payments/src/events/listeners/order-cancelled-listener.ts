import { OrderCancelledEvent, Subjects, Listener, OrderStatus } from "@kunleticket/common";
import { queGroupName } from "./que-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queGroupName = queGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    });

    if (!order) throw new Error('order was not found!');

    order.set({
      status: OrderStatus.Cancelled
    });

    await order.save();

    msg.ack();
  }
}