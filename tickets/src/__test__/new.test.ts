import request from "supertest";
import { app } from "../app";


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
it('returns an error if an invalid title is provided', async () => {

})
it('returns an error if an invalid price is provided', async () => {

})