import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import cookieSession from "cookie-session";
import dotenv from 'dotenv';
import cors from 'cors'
import { createTicketRouter } from './routes/new'

import { errorHandler, NotFoundError } from '@kunleticket/common'

dotenv.config({ path: './config.env' })
const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed: false,
  // secure: true,
}));
app.use(cors())

app.use(createTicketRouter)


app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app };