import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from '../../models/tickets';




it('returns a 404 if provided id doesnt exist', async () => {
  let id = new mongoose.Types.ObjectId().toHexString();

  await request(app).patch(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: "hsnsk",
      price: 200
    })
    .expect(404)
})

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).patch(`/api/tickets/${id}`)
    .send({})
    .expect(401)
})

it('returns a 401 if logged in user is not the creator of the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asldjK',
      price: 200
    })

  await request(app)
    .patch(`/api/tickets/${response.body.ticket.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'a new show',
      price: 3
    })
    .expect(401)

})

it('returns a 400 if user provides inavalid title or price', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldjK',
      price: 200
    });

  await request(app)
    .patch(`/api/tickets/${response.body.ticket.id}`)
    .set('Cookie', cookie)
    .send({
      price: -3
    })
    .expect(400)
})


it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldjK',
      price: 200
    });

  await request(app)
    .patch(`/api/tickets/${response.body.ticket.id}`)
    .set('Cookie', cookie)
    .send({
      price: 70,
      title: 'ftrwk'
    })
    .expect(200)

  const newTicket = await request(app).get(`/api/tickets/${response.body.ticket.id}`).expect(200)

  expect(newTicket.body.price).toEqual(70)
})



it('publishes an event', async () => {
  const cookie = global.signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldjK',
      price: 200
    });


  expect(natsWrapper.client.publish).toHaveBeenCalled()

});

it('disallows updating a reserved ticket', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldjK',
      price: 200
    });

  const ticket = await Ticket.findById(response.body.ticket.id);

  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  await ticket!.save();

  await request(app)
    .patch(`/api/tickets/${response.body.ticket.id}`)
    .set('Cookie', cookie)
    .send({
      price: 70,
      title: 'ftrwk'
    })
    .expect(400)



})