import express, { Request, Response } from 'express';
import { currentUser, requireAuth } from '@kunleticket/common';


const router = express.Router();

router.post('/api/tickets', currentUser, requireAuth, (req: Request, res: Response) => {
  res.status(200).send({})
});

export { router as createTicketRouter } 