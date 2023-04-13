import mongoose from 'mongoose';
import { isNumericLiteral } from 'typescript';

// an interface that describes the properties that are required to create a new user. 

interface TicketAttrs {
  title: string;
  price: string;
  userId: string
};

interface TicketDocs extends mongoose.Document {
  title: string;
  price: number;
  userId: string
};

interface TicketModel extends mongoose.Model<TicketDocs> {
  build(attrs: TicketAttrs): TicketDocs;
};

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'your ticket should have a title']
  },
  price: {
    type: Number,
    required: [true, 'your ticket should have a valid price']
  },
  userId: {
    type: String,
    required: true
  },
},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  });

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
};
const Ticket = mongoose.model<TicketDocs, TicketModel>('Ticket', ticketSchema)

export { Ticket }

