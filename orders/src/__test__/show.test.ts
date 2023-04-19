import { app } from "../app";
import mongoose from "mongoose";
import request from 'supertest'
import { Ticket } from "../model/ticket";

it('fetches the order', async () => {
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


  //make test ftech the order 

  const { body: fetchedOrder } = await request(app).get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200)

  expect(fetchedOrder.id).toEqual(order.id)
});



it("dosen't allow a user to fetch other users orders", async () => {
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

  await request(app).get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .expect(401)

})