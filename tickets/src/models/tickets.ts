import mongoose from 'mongoose';
import { isNumericLiteral } from 'typescript';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// an interface that describes the properties that are required to create a new user. 

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
};

interface TicketDocs extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
  orderId: {
    type: String
  }
},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  });
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.pre('save', function (done) {
  this.increment()
  done();
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
};
const Ticket = mongoose.model<TicketDocs, TicketModel>('Ticket', ticketSchema)

export { Ticket }

