import { currentUser, requireAuth, NotAUthorizedError, NotFoundError, OrderStatus } from '@kunleticket/common';
import express, { Request, Response } from 'express'
import { Order } from '../model/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Ticket } from '../model/ticket';

const router = express.Router();

router.delete('/api/orders/:orderId', currentUser, requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket')

  if (!order) throw new NotFoundError('no order found')

  if (order.userId !== req.currentUser!.id) throw new NotAUthorizedError()

  order.status = OrderStatus.Cancelled

  await order.save()

  //publish an event saying this was cancelled
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id
    }
  })


  res.status(204).send(order)
});

export { router as deleteOrderRouter }