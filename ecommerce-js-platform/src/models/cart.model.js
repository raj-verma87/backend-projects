const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ]
});

module.exports = mongoose.model('Cart', CartSchema);
