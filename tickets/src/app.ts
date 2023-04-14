import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import cookieSession from "cookie-session";
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from "./routes/show";
import { IndexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/updateticket";
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';

import { errorHandler, NotFoundError } from '@kunleticket/common'

dotenv.config({ path: './config.env' })
const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed: false,
  // secure: true,
}));
app.use(cookieParser())

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(IndexTicketRouter)
app.use(updateTicketRouter)


app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app };