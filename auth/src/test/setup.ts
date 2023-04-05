import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { app } from '../app';
import request, { Response } from 'supertest'

// declare global {
//   namespace NodeJS {
//     interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

declare global {
  var signin: () => Promise<string[]>
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

global.signin = async () => {
  const email = 'test@test.com'
  const password = 'password'

  const response = await request(app)
    .post('/api/user/signup')
    .send({ email, password })
  const cookie = response.get('Set-Cookie');

  return cookie
}

