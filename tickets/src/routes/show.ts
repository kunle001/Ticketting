import express from "express";
import { Ticket } from "../models/tickets";
import { NotFoundError } from "@kunleticket/common";

const router = express.Router();

router.get('/api/tickets/:id', async (req, res) => {

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  const { title, price } = ticket;

  res.status(200).json({
    id: req.params.id,
    title,
    price
  });
});

export { router as showTicketRouter }