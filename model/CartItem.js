const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the CartItem schema
const cartItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
 
});

// Create the CartItem model using the schema
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;