import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on sucessful signup', async () => {
  return request(app)
    .post('/api/user/signup')
    .send({
      email: "test@email.com",
      password: "password"
    })
    .expect(201)
});

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/user/signup')
    .send({
      email: "testtest.com",
      password: "password"
    })
    .expect(400)
});

it('returns a 400 with invalid pawword', async () => {
  return request(app)
    .post('/api/user/signup')
    .send({
      email: "test@test.com",
      password: "p"
    })
    .expect(400)
});

it('returns a 400 if missing email and password', async () => {
  return request(app)
    .post('/api/user/signup')
    .send({})
    .expect(400)
})

it('disapllows existing email', async () => {
  await request(app)
    .post('/api/user/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)

  await request(app)
    .post('/api/user/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(400)

});

it('returns a 201 on sucessful signup', async () => {
  const response = await request(app)
    .post('/api/user/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined();
});
