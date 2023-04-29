import request from "supertest";
import { app } from "../../app";


it('should respond with details about the current user', async () => {

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', global.signin())
    .expect(200)

  expect(response.body.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .expect(401)
})