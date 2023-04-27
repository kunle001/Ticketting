import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import cookieSession from "cookie-session";
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';

import { currentUser, errorHandler, NotFoundError } from '@kunleticket/common'
import { createChargeRouter } from "./routes/new";

dotenv.config({ path: './config.env' })
const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed: false,
  // secure: true,
}));
app.use(cookieParser());
app.use(currentUser)

app.use(createChargeRouter);



app.all('*', async () => {
  throw new NotFoundError('page not found')
})

app.use(errorHandler);

export { app };