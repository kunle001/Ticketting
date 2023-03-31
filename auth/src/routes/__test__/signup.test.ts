import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on sucessful signup', async () => {
  return request(app)
    .post('/api/user/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)
});

it('returns a 401  fobidden', async () => {
  return request(app)
    .get('/api/user/currentUser')
    .expect(401)
})

it('returns a 200  for logged in', async () => {
  return request(app)
    .post('/api/user/signin')
    .send({
      email: "test@test.com",
      password: "kunle111"
    })
    .expect(400)
})