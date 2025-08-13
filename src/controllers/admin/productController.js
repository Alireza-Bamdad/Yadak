import Product from '../../models/Products.js';
import { handleServerError, handleNotFound, handleConflict } from '../../errorHandling/errorHandler.js';

export const createProduct = async (req, res) => {
  const { name, description, price, stock, category_id, image_url } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category_id,
      image_url,
    });
    res.status(201).json({ message: 'محصول با موفقیت ایجاد شد', productId: newProduct.id });
  }catch (error) {
    // console.error(error);

    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      const errorMessages = error.errors.map(err => {
        return {
          path: err.path,  
          message: `فیلد ${err.path} خطا دارد: ${err.message}`,  
        };
      });

      return res.status(400).json({
        message: 'خطای اعتبارسنجی',
        errors: errorMessages,  
      });
    }

    return res.status(500).json({
      message: 'خطای داخلی سرور، لطفاً دوباره تلاش کنید',
      error: error.message, // خطای عمومی
    });
  }
};


export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category_id, image_url } = req.body;
  try {
    const product = await Product.findByPk(id);
    if (!product) return handleNotFound(res, 'محصول');

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category_id = category_id || product.category_id;
    product.image_url = image_url || product.image_url;

    await product.save();

    res.json({ message: 'محصول با موفقیت ویرایش شد' });
  }catch (error) {

    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      const errorMessages = error.errors.map(err => {
        return {
          path: err.path,  
          message: `فیلد ${err.path} خطا دارد: ${err.message}`,  
        };
      });

      return res.status(400).json({
        message: 'خطای اعتبارسنجی',
        errors: errorMessages,  
      });
    }

    return res.status(500).json({
      message: 'خطای داخلی سرور، لطفاً دوباره تلاش کنید',
      error: error.message, 
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) return handleNotFound(res, 'محصول');

    await product.destroy();
    res.json({ message: 'محصول با موفقیت حذف شد' });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (e) {
    return handleServerError(res, e);
  }
};
