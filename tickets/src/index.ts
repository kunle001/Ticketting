import 'express-async-errors';
import { ConnectOptions } from 'mongoose'
import mongoose from "mongoose";
import { app } from './app';
import { natsWrapper } from './nats-wrapper';



const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('no JWT_KEY')
  }
  if (!process.env.NATS_URL) throw new Error('provide nats url')
  if (!process.env.NATS_CLIENT_ID) throw new Error('provide nats client_id ')
  if (!process.env.NATS_CLUSTER_ID) throw new Error('provide nats cluster_id')
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    natsWrapper.client.on('close', () => {
      process.on('SIGINT', () => natsWrapper.client.close())
      process.on('SIGTERM', () => natsWrapper.client.close())
    })
    await mongoose.connect(process.env.DB!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log('DB conected')
  } catch (err) {
    console.log(err)
  };
  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();


