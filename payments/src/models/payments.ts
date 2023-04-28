import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
};

interface PaymentsDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
};

interface PaymentsModel extends mongoose.Model<PaymentsDoc> {
  build(attrs: PaymentAttrs): PaymentsDoc
};

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'orderId is required']
  },
  stripeId: {
    type: String,
    required: [true, 'provide the stripe token']
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
});

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId
  })

};

const Payment = mongoose.model<PaymentsDoc, PaymentsModel>('Payments', paymentSchema);

export { Payment }

