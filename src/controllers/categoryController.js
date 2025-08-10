
import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
 
    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

 
    const newCategory = await Category.create({
      name,
      description,
    });

    res.status(201).json({ message: 'Category created successfully', categoryId: newCategory.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
