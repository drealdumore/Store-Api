import { Cart, CartItem } from "../models/cartModel.js";
import Product from "../models/productModel.js";
import catchAsync from "../utilities/catchAsync.js";
import AppError from "../utilities/appError.js";

// ADD TO CART
export const addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("User not authenticated", 401));
  }

  if (!productId || !quantity) {
    return next(new AppError("Product ID and quantity are required", 400));
  }

  // Find the user's cart
  let cart = await Cart.findOne({ user: userId });

  // if cart is empty, create a new one
  // Create a new cart if it doesn't exist
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // check if product exists
  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const existingItem = cart.items.find((item) =>
    item.product.equals(productId)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    // Create a new cart item
    const cartItem = new CartItem({
      productId,
      quantity,
      price,
      cartId: cart._id,
    });

    // Save the cart item
    await cartItem.save();

    // Add the cart item to the cart's items array
    cart.items.push(cartItem._id);
  }

  cart.totalPrice += price * quantity;

  await cart.save();

  res.status(200).json({ message: "Product added to cart successfully", cart });
});

// REMOVE FROM CART
export const removeFromCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("User not authenticated", 401));
  }

  if (!productId || !quantity) {
    return next(new AppError("Product ID and quantity are required", 400));
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const existingItem = cart.items.find((item) =>
    item.product.equals(productId)
  );

  if (!existingItem) {
    return next(new AppError("Product not found in cart", 404));
  }

  if (existingItem.quantity > quantity) {
    existingItem.quantity -= quantity;
  } else {
    cart.items = cart.items.filter((item) => !item.product.equals(productId));
    cart.items = cart.items.filter((item) => !item.product.equals(productId));
    cart.totalPrice -= existingItem.price * existingItem.quantity;
  }

  await cart.save();

  res
    .status(200)
    .json({ message: "Product removed from cart successfully", cart });
});

// GET CART ITEMS
export const getCart = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError("User not authenticated", 401));
  }

  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  res.status(200).json({ message: "success", cart });
});

// MERGE CART ITEMS STORED IN LOCAL STORAGE WHEN USER WASN'T SIGNED IN
export const mergeCart = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;
  const { items } = req.body;

  if (!userId) {
    return next(new AppError("User not authenticated", 401));
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  for (const item of items) {
    const { productId, quantity } = item;
    const product = await Product.findById(productId);

    if (!product) {
      return next(new AppError(`Product with ID ${productId} not found`, 404));
    }

    const existingItem = cart.items.find((cartItem) =>
      cartItem.product.equals(productId)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const cartItem = new CartItem({
        product: productId,
        quantity,
        price: product.price,
        cart: cart._id,
      });

      await cartItem.save();
      cart.items.push(cartItem._id);
    }

    cart.totalPrice += product.price * quantity;
  }

  await cart.save();

  res.status(200).json({ message: "Cart merged successfully", cart });
});
