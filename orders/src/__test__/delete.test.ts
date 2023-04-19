import { app } from "../app";
import mongoose from "mongoose";
import request from 'supertest'
import { Ticket } from "../model/ticket";
import { OrderStatus } from "@kunleticket/common";
import { natsWrapper } from "../nats-wrapper";

it('cancels the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 23
  });

  await ticket.save()

  const user = global.signin();
  //make a request to build am oder with this ticket 
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201)

  //delete the order

  await request(app).delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204)

  //Confirming the test was updated
  const response = await request(app).get(`/api/orders/${order.id}`)
    .set('Cookie', user)

  expect(response.body.status).toBe(OrderStatus.Cancelled)
});



it("dosen't allow a user to delete other users orders", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 23
  });

  await ticket.save()

  const user = global.signin();
  //make a request to build am oder with this ticket 
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201)


  //fetch the order 

  await request(app).delete(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .expect(401)

});

it('emits an order cancelled event', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 23
  });

  await ticket.save()

  const user = global.signin();
  //make a request to build am oder with this ticket 
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id
    })
    .expect(201)

  //delete the order

  await request(app).delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

})