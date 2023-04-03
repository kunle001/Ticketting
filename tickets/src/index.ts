import 'express-async-errors';
import { ConnectOptions } from 'mongoose'
import mongoose from "mongoose";
import dotenv from 'dotenv'
import { app } from './app'

dotenv.config({ path: './config.env' })


const start = async () => {
  if (!process.env) {
    throw new Error('no JWT_KEY')
  }
  try {
    await mongoose.connect(process.env.DB!.replace('<password>', process.env.DB_PASSWORD!), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log('DB conected')
  } catch (err) {
    console.log(err)
  };
  app.listen(4000, () => {
    console.log("Listening on port 4000");
  });
};

start();


