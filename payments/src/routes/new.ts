import { BadRequestError, NotAUthorizedError, NotFoundError, OrderStatus, currentUser, requireAuth, validateRequest } from '@kunleticket/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';


const router = express.Router();

router.post('/api/payments', requireAuth, [
  body('token')
    .not()
    .isEmpty(),
  body('orderId')
    .not()
    .isEmpty(),
], validateRequest, async (req: Request, res: Response) => {

  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) throw new NotFoundError('order is not found');
  if (order.userId !== req.currentUser!.id) throw new NotAUthorizedError();

  if (order.status === OrderStatus.Cancelled) throw new BadRequestError('this order is cancelled');

  await stripe.charges.create({
    currency: 'usd',
    source: token,
    amount: order.price * 100
  });


  res.status(201).send({
    sucesss: true
  })

});

export { router as createChargeRouter }