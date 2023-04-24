import { TicketUpdatedListener } from "../events/listeners/ticket-updated-listener";
import { Ticket } from "../model/ticket";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@kunleticket/common";
import { Message } from "node-nats-streaming";



const setup = async () => {
  // Create a listener 
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket 
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'conert',
    price: 200
  })
  await ticket.save()
  // create a fake data
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concwert',
    price: 999,
    userId: 'cbywuiubcuiws'
  }


  // create fake msg objestr
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  // return all this
  return { listener, ticket, msg, data }
}


it('finds, updates and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)

});

it('acks the message', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()

});

it('does not call ack if event version is not concurrent', async () => {
  const { msg, data, ticket, listener } = await setup();

  data.version = 10
  try {
    await listener.onMessage(data, msg)
  } catch (err) {

  };

  expect(msg.ack).not.toHaveBeenCalled()

})