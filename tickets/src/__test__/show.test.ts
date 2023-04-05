import request from 'supertest';
import { app } from '../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/tickets/${id}`)
    .expect(404);
});

it('returns the ticket if it was found', async () => {
  const title = 'a show';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  await request(app)
    .get(`/api/tickets/${response.body.ticket.id}`)

  expect(response.body.ticket.title).toEqual(title);
  expect(response.body.ticket.price).toEqual(price);
});
