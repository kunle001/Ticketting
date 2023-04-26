import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../model/ticket';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../../model/order';
import { ExpirationCompleteEvent } from '@kunleticket/common';
import { Message } from 'node-nats-streaming';


const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'bsoiw',
    price: 200
  })

  await ticket.save()
  const order = Order.build({
    userId: 'asdf',
    ticket,
    expiresAt: new Date(),
    status: OrderStatus.Created,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, msg, data, order, ticket }

};

it('updates the order status to cancelled', async () => {
  const { listener, msg, data, order, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it('emits an OrderCancelled event', async () => {
  const { listener, msg, data, order, ticket } = await setup()

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled()


  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )
  expect(eventData.id).toEqual(order.id)
});


it('ack the message', async () => {
  const { listener, msg, data, order, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()

})