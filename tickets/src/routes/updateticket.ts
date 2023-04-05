import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotAUthorizedError, NotFoundError, currentUser, requireAuth, validateRequest } from '@kunleticket/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.patch('/api/tickets/:id', currentUser, requireAuth, [
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('must be a number greater than 0')
], validateRequest, async (req: Request, res: Response) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!ticket) {
    throw new NotFoundError();
  };
  if (req.currentUser!.id !== ticket.userId) {
    throw new NotAUthorizedError()
  }

  res.send(ticket)
});

export { router as updateTicketRouter }