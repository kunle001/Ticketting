import { NotAUthorizedError, NotFoundError, currentUser, requireAuth } from '@kunleticket/common';
import express, { Request, Response } from 'express'
import { Order } from '../model/order';

const router = express.Router();

router.get('/api/orders/:orderId', currentUser, requireAuth, async (req: Request, res: Response) => {

  const order = await Order.findById(req.params.orderId).populate('ticket')

  if (!order) throw new NotFoundError('no order found')

  if (order.userId !== req.currentUser!.id) throw new NotAUthorizedError()

  res.status(200).send(order)
});

export { router as showOrderRouter }