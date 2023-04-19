import express, { Request, Response } from 'express'
import { requireAuth, validateRequest, currentUser, NotFoundError, OrderStatus, BadRequestError } from '@kunleticket/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../model/ticket';
import { Order } from '../model/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders', currentUser, requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket Id is required')

], validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body
  // Find ticket in the DB
  const ticket = await Ticket.findById(ticketId)
  if (!ticket) throw new NotFoundError('ticket not found');

  // MAke sure that this ticket is not already resrved
  // RUn query to look at all orders. Find an Order where the ticket 
  // is the ticket we just found and the orders status is *not* cancelled 
  // if we find an order from that, it means the order is reserved


  const isReserved = await ticket.isReserved();

  if (isReserved) throw new BadRequestError('ticket is already reserved')

  // Calculte an expiration date fro the order 
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  // BUild the order and save into db

  const order = Order.build({
    userId: req.currentUser!.id,
    ticket,
    status: OrderStatus.Created,
    expiresAt: expiration
  });

  await order.save();

  //publish
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  })

  res.status(201).send(order)
});

export { router as createOrderRouter }