const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the order schema
const orderSchema = new Schema({
  name: { 
    type: String 
  },
  email: {
     type: String
    },
  phone: {
     type: String
    },
  address: {
     type: String
    }
});

// Create the order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
