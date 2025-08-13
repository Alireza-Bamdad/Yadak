// src/controllers/addressController.js
import Address from '../../models/Address.js';

export const createAddress = async (req, res) => {
  const { address, postal_code, unit, floor, description } = req.body;

  try {
    const newAddress = await Address.create({
      address,
      postal_code,
      unit,
      floor,
      description,
      user_id: req.user.id,
    });

    res.status(201).json({ message: 'آدرس با موفقیت اضافه شد', addressId: newAddress.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },  
    });

    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

export const getAddressById = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findOne({
      where: { id, user_id: req.user.id },  
    });

    if (!address) {
      return res.status(404).json({ message: 'آدرس پیدا نشد' });
    }

    res.status(200).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { address, postal_code, unit, floor, description } = req.body;

  try {
    const existingAddress = await Address.findOne({ where: { id, user_id: req.user.id } });

    if (!existingAddress) {
      return res.status(404).json({ message: 'آدرس پیدا نشد' });
    }

    existingAddress.address = address || existingAddress.address;
    existingAddress.postal_code = postal_code || existingAddress.postal_code;
    existingAddress.unit = unit || existingAddress.unit;
    existingAddress.floor = floor || existingAddress.floor;
    existingAddress.description = description || existingAddress.description;

    await existingAddress.save();

    res.status(200).json({ message: 'آدرس با موفقیت به‌روزرسانی شد' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

export const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findOne({
      where: { id, user_id: req.user.id },  
    });

    if (!address) {
      return res.status(404).json({ message: 'آدرس پیدا نشد' });
    }

    await address.destroy();

    res.status(200).json({ message: 'آدرس با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};
