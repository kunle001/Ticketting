import request from 'supertest';
import { app } from '../app';



it('can fetch a list of tickets', async () => {
  await global.createTicket()
  await global.createTicket();
  await global.createTicket();

  const res = await request(app).get('/api/tickets')
    .expect(200)

  expect(res.body.length === 3)

})