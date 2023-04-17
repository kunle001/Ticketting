import express from "express";
import { json } from "body-parser";
import 'express-async-errors';
import cookieSession from "cookie-session";
import cookieParser from 'cookie-parser'
import { deleteOrderRouter } from "./routes/delete";
import { createOrderRouter } from "./routes/new";
import { indexOrderRouter } from "./routes";
import { showOrderRouter } from "./routes/show";


import { errorHandler, NotFoundError } from '@kunleticket/common'


const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed: false,
  // secure: true,
}));
app.use(cookieParser())
app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(createOrderRouter)
app.use(showOrderRouter)



app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler);

export { app };