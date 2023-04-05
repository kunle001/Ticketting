import request from "supertest";
import { app } from "../app";
import { Ticket } from '../models/tickets'


it('has a route handler listening to /api/tickets for posts requests', async () => {

  const response = await request(app)
    .post('/api/tickets')
    .send({})
  expect(response.status).not.toEqual(404)

})
it('refuse request if not authorized', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)

})
it('returns an status other than 401', async () => {

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({})

  expect(response.status).not.toEqual(401)
});


it('returns an error if an invalid price or title is provided is provided', async () => {

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Don moen',
      price: ''
    })
    .expect(400)

  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: '',
    price: 12
  }).expect(400)

  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'Micheal Smith',
    price: -12
  }).expect(400)

  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    price: 12
  }).expect(400)

});

it('check if a ticket was saved to DB', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'when funaab worships',
    price: 3
  }).expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual('when funaab worships')


})
it('returns an error if an invalid price is provided', async () => {


})