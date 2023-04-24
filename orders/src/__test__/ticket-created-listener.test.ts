import { Message } from "node-nats-streaming";
import { TicketCreatedEVent } from "@kunleticket/common";
import { TicketCreatedListener } from "../events/listeners/ticket-created-listener";
import { natsWrapper } from "../nats-wrapper";
import mongoose, { set } from "mongoose";
import { Ticket } from "../model/ticket";


const setup = async () => {
  // create an instance of the listener 
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data 

  const data: TicketCreatedEVent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // create a fake msg object 
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()

  }

  return { listener, data, msg };

}


it('creates and saves a ticket', async () => {
  // create an instance of the listener 
  const { listener, data, msg } = await setup();

  // call onnMessage function with data object 
  await listener.onMessage(data, msg)

  // write assertions to make sure a ticket was created 
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)


})

it('acks the nmessage', async () => {
  // create an instance of the listener 
  const { data, listener, msg } = await setup()
  // call the onMEssage function with the data object +message object 
  await listener.onMessage(data, msg);


  // create assertion to make sure the ack function was be=ing called 
  expect(msg.ack).toHaveBeenCalled()

});