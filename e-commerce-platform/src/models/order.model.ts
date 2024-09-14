import mongoose, { Schema, Document } from 'mongoose';

// Define the Order document interface
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Order schema
const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' }, // Order status (e.g., pending, confirmed, shipped, delivered)
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the Order model
const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
