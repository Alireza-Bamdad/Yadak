// src/controllers/productControllers.js
import Product from '../models/Products.js';
import Category from '../models/Category.js';
import upload from '../middleware/upload.js';  

export const createProduct = async (req, res) => {
  const { name, description, price, stock, categoryName } = req.body;
  const image_url = req.file ? req.file.path : null; 

  try {
    const category = await Category.findOne({ where: { name: categoryName } });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category_id: category.id,
      image_url,  
    });

    res.status(201).json({ message: 'Product created successfully', productId: newProduct.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const { id } = req.params;
  const image_url = req.file ? req.file.path : null;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = (price ?? product.price);
    product.stock = (stock ?? product.stock);
    product.image_url = image_url ?? product.image_url;

    await product.save();
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const items = await Product.findAll();
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};
