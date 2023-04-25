import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotAUthorizedError, NotFoundError, currentUser, requireAuth, validateRequest } from '@kunleticket/common';
import { Ticket } from '../models/tickets';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.patch('/api/tickets/:id', currentUser, requireAuth, [
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('must be a number greater than 0')
], validateRequest, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    throw new NotFoundError('Ticket not found');
  }

  if (ticket.orderId) {
    throw new BadRequestError('Ticket is Reserved, cannot edit it')
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAUthorizedError();
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price
  });

  await ticket.save();

  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  res.send(ticket);
});

export { router as updateTicketRouter }
