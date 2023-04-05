import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { app } from '../app';
import request, { Response } from 'supertest'
import jwt from 'jsonwebtoken'

declare global {
  var signin: () => string[]
}

declare global {
  var createTicket: () => {}
}

let mongo: any

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  await mongo.start()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany()
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();

});

global.signin = () => {
  let id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: 'test@test.com'
  };
  //  Create the JWT 

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build Session object
  const session = { jwt: token }

  // Turn session to json
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //  return a string thats the cookie with encoded data

  return [`session=${base64}`]

};

global.createTicket = () => {

  return request(app).post('/api/ticket')
    .set('Cookie', global.signin())
    .send({
      title: 'some show',
      price: 300
    })

}

