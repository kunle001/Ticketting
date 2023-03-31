import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import { ConnectOptions } from 'mongoose'
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import dotenv from 'dotenv'


import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './midllewares/error-handlers'
import { NotFoundError } from './errors/not-found-error'

dotenv.config({ path: './config.env' })
const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed: false,
  // secure: true,
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)


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
  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();


