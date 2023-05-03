import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import jwt from 'jsonwebtoken'

declare global {
  var signin: () => string[]
}

declare global {
  var createTicket: () => {}
}

jest.mock('../nats-wrapper')

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'kunle'
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
  jest.clearAllMocks()

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

  return [`secretoken=${token}`]

};

