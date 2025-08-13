import Payment from '../../models/Payment.js';
import Order from '../../models/Order.js';

export const createPayment = async (req, res) => {
  try {
    const { order_id, amount, payment_method, payment_status } = req.body;
    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const newPayment = await Payment.create({
      order_id,
      amount,
      payment_method,
      payment_status,
    });

    res.status(201).json({ success: true, payment: newPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
