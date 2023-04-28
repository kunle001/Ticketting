import { BadRequestError, NotAUthorizedError, NotFoundError, OrderStatus, currentUser, requireAuth, validateRequest } from '@kunleticket/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payments';
import { PyamentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';


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

  const charge = await stripe.charges.create({
    currency: 'usd',
    source: token,
    amount: order.price * 100
  });


  const payments = Payment.build({
    orderId,
    stripeId: charge.id
  });
  console.log(payments)
  await payments.save()

  await new PyamentCreatedPublisher(natsWrapper.client).publish({
    id: payments.id,
    orderId: payments.orderId,
    stripeId: payments.stripeId
  })


  res.status(201).send({
    id: payments.id
  })

});

export { router as createChargeRouter }