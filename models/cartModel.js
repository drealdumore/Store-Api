import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "CartItem" }],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = model("cart", cartSchema);


const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
  },
  { timestamps: true }
);

export const CartItem = model("CartItem", cartItemSchema);