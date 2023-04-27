import { OrderStatus } from "@kunleticket/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface OrderAttrs {
  id: string,
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
};

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
};

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc

};

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: [true, 'userID is required for the order']
  },
  price: {
    type: Number,
    required: true,
  },

}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    status: attrs.status,
    userId: attrs.userId
  })
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order }