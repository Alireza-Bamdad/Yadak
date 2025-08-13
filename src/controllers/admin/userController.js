import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import { handleServerError, handleNotFound, handleConflict } from '../../errorHandling/errorHandler.js';

export const createUser = async (req, res) => {
  const { first_name, last_name, phone, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ where: { phone } });
    if (existing) return handleConflict(res, 'شماره تلفن');

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return  handleConflict(res, 'ایمیل ');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      phone,
      email,
      password_hash: hashedPassword,
      role: role || 'user',
    });

    res.status(201).json({ message: 'کاربر با موفقیت ایجاد شد', userId: newUser.id });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone, email, role } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return handleNotFound(res, 'کاربر');

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return handleConflict(res, 'ایمیل');
      user.email = email;
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.phone = phone || user.phone;
    user.role = role || user.role;

    await user.save();

    res.json({ message: 'کاربر با موفقیت ویرایش شد' });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return handleNotFound(res, 'کاربر');

    await user.destroy();
    res.json({ message: 'کاربر با موفقیت حذف شد' });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'phone', 'email', 'role', 'is_verified', 'created_at'],
    });
    res.json(users);
  } catch (e) {
    return handleServerError(res, e);
  }
};
