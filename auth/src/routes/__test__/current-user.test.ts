import request from "supertest";
import { app } from "../../app";


it('should respond with details about the current user', async () => {
  const authResponse = await request(app)
    .post('/api/user/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
  const cookie = authResponse.get('Set-Cookie')

  const response = await request(app)
    .get('/api/user/currentuser')
    .set('Cookie', cookie)
    .expect(200)

  expect(response.body.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/user/currentuser')
    .expect(401)
})