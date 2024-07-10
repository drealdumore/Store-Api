import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = model("Category", orderSchema);

export default Order;
