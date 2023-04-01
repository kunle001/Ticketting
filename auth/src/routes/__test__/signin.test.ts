import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';


it('returns a 400 if user doesnt exist on DB', async () => {
  return request(app)
    .post('/api/user/signin')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(400)
});

it('returns a 200 on sucessful sigin', async () => {

  await request(app)
    .post('/api/user/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)

  const response = await request(app)
    .post('/api/user/signin')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(200)
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should fail, given wrong password', async () => {

  await request(app)
    .post('/api/user/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)

  await request(app)
    .post('/api/user/signin')
    .send({
      email: "test@test.com",
      password: "password11"
    })
    .expect(400)

});