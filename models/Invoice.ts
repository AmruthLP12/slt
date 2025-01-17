const mongoose = require("mongoose");

// Define the schema for items
const ItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Define the schema for the order
const OrderSchema = new mongoose.Schema({
  customerName: { type: String },
  phoneNumber: { type: String },
  cardNumber: { type: String, required: true },
  currentDate: { type: Date, required: true },
  deliveryDate: { type: Date, required: true },
  advance: { type: Number },
  grandTotal: { type: Number, required: true },
  remainingTotal: { type: Number, required: true },
  items: { type: [ItemSchema], required: true },
});

// Create the model
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

// Export the model
export default Order;
