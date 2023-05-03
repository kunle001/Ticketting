import express from "express";
import { Ticket } from "../models/tickets";
import { NotFoundError } from "@kunleticket/common";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.get('/api/tickets/:id', async (req, res) => {

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError('ticket not found');
  }

  ticket.set({
    viewsCount: ticket.viewsCount + 1
  });

  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  const { title, price } = ticket;

  res.status(200).json({
    id: req.params.id,
    title,
    price
  });
});

export { router as showTicketRouter }