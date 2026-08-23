const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper: populate cart with current product data and calculate totals
const getPopulatedCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    'items.product',
    'name price salePrice stock images status'
  );

  if (!cart) return { items: [], subtotal: 0, total: 0, itemCount: 0 };

  // Filter out items where product was deleted or is no longer active
  const validItems = cart.items.filter(
    (item) => item.product && item.product.status === 'Active'
  );

  const enriched = validItems.map((item) => {
    const effectivePrice = item.product.salePrice || item.product.price;
    return {
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0]?.url || '',
      price: effectivePrice,
      stock: item.product.stock,
      quantity: item.quantity,
      lineTotal: effectivePrice * item.quantity,
    };
  });

  const subtotal = enriched.reduce((sum, i) => sum + i.lineTotal, 0);

  return {
    items: enriched,
    subtotal,
    total: subtotal, // delivery charge calculated separately
    itemCount: enriched.reduce((sum, i) => sum + i.quantity, 0),
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cartData = await getPopulatedCart(req.user._id);
    res.json(cartData);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (or increase quantity if already exists)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product || product.status !== 'Active') {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units available in stock`,
        });
      }
      existingItem.quantity = newQty;
    } else {
      if (Number(quantity) > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units available in stock`,
        });
      }
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    const cartData = await getPopulatedCart(req.user._id);
    res.json(cartData);
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} units available in stock`,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const cartData = await getPopulatedCart(req.user._id);
    res.json(cartData);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();

    const cartData = await getPopulatedCart(req.user._id);
    res.json(cartData);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear the entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );
    res.json({ items: [], subtotal: 0, total: 0, itemCount: 0 });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
