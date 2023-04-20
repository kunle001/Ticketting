import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotAUthorizedError, NotFoundError, currentUser, requireAuth, validateRequest } from '@kunleticket/common';
import { Ticket } from '../models/tickets';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';


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
    throw new NotFoundError('ticket is not found');
  };
  if (req.currentUser!.id !== ticket.userId) {
    throw new NotAUthorizedError()
  }

  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  })

  res.send(ticket)
});

export { router as updateTicketRouter }