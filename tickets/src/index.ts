import 'express-async-errors';
import { ConnectOptions } from 'mongoose'
import mongoose from "mongoose";
import { app } from './app'



const start = async () => {
  if (!process.env) {
    throw new Error('no JWT_KEY')
  }
  try {
    await mongoose.connect('mongodb+srv://kunle:XIy7Y9WJm3EGjLAJ@cluster0.pt7cycb.mongodb.net/test', {
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


