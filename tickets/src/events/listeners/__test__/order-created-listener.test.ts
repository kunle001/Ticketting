import { OrderCreatedEvent, OrderStatus } from "@kunleticket/common"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

const setup = async () => {
  // create an instance of the listener 

  const listener = new OrderCreatedListener(natsWrapper.client)


  // create and save a ticket 
  const ticket = Ticket.build({
    title: 'consert ',
    price: 99,
    userId: 'asdf'
  });

  await ticket.save()

  // create a fake data event 
  const data: OrderCreatedEvent['data'] = {
    ticket: {
      id: ticket.id,
      price: ticket.price
    },
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sguysg',
    expiresAt: 'jkbd'
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { ticket, data, msg, listener }

};

it('sets userId of the tickets', async () => {
  const { ticket, data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).toEqual(data.id);


});

it('acks the message', async () => {
  const { ticket, data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled()

});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();


  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[2][1])

  expect(data.id).toEqual(ticketUpdatedData.orderId)
})