import Category from '../../models/Category.js';
import Product from '../../models/Products.js';
import { handleServerError, handleNotFound, handleConflict } from '../../errorHandling/errorHandler.js';

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existing = await Category.findOne({ where: { name } });
    if (existing) return handleConflict(res, 'نام دسته‌بندی');

    const newCategory = await Category.create({
      name,
      description,
    });

    res.status(201).json({ message: 'دسته‌بندی با موفقیت ایجاد شد', categoryId: newCategory.id });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) return handleNotFound(res, 'دسته‌بندی');

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    res.json({ message: 'دسته‌بندی با موفقیت ویرایش شد' });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'دسته‌بندی مورد نظر پیدا نشد' });

    await Product.update({ category_id: 1 }, { where: { category_id: id } });

    await category.destroy();

    res.json({ message: 'دسته‌بندی حذف شد و محصولات به دسته‌بندی پیش‌فرض منتقل شدند' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطای داخلی سرور، لطفاً دوباره تلاش کنید' });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (e) {
    return handleServerError(res, e);
  }
};
