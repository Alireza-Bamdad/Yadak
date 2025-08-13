import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const { user_id } = req.user;  
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existingCartItem = await Cart.findOne({ where: { product_id, user_id } });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({ success: true, cartItem: existingCartItem });
    }

    const newCartItem = await Cart.create({ product_id, quantity, user_id });
    res.status(201).json({ success: true, cartItem: newCartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { user_id } = req.user;
    const cartItems = await Cart.findAll({ where: { user_id } });
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user_id } = req.user; 
    const cartItem = await Cart.findOne({ where: { product_id: productId, user_id } });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(200).json({ success: true, message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const { user_id } = req.user; 

    const cartItem = await Cart.findOne({ where: { product_id: productId, user_id } });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json({ success: true, cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
