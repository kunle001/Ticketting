import mongoose from "mongoose";
import request from 'supertest'
import { Order } from "../model/order";
import { Ticket } from "../model/ticket";
import { app } from "../app";


const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save()

  return ticket
}


it('fetches orders for a particular user', async () => {
  // create three ticket
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = global.signin()
  const userTwo = global.signin()
  //create 1 order as User 1
  await request(app).post('/api/orders')
    .set('Cookie', userOne)
    .send({
      ticketId: ticketOne.id
    })
    .expect(201)

  // create two orders by user 2
  const { body: orderOne } = await request(app).post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketTwo.id
    })
    .expect(201)

  const { body: OrderTwo } = await request(app).post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketThree.id
    })
    .expect(201)

  //Make request to get orders for user number 2

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  expect(response.body.length).toEqual(2)
  expect(orderOne.id).toBe(response.body[0].id)
  expect(OrderTwo.id).toBe(response.body[1].id)
  expect(ticketTwo.id).toBe(response.body[0].ticket.id)
  expect(ticketThree.id).toBe(response.body[1].ticket.id)


  // make sure we only got the orders for User 2
})