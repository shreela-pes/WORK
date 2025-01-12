import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  // console.log('Received order request:', req.body);
  // console.log('User from request:', req.user);

  try {
    console.log('Request Body:', req.body);
     console.log('Request User:', req.user);
    const order = new Order({
      ...req.body,
      customerId: req.user.id
    });
    console.log('Order to Save:', order);
    await order.save();
    console.log('Order Saved Successfully:', order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error saving order:', error.message);
    res.status(400).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { newAddress } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: id, customerId: req.user.id },
      { address: newAddress },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found or you're not authorized to update this order." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: "Failed to update address." });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndDelete({ _id: id, customerId: req.user.id });
    if (!order) {
      return res.status(404).json({ message: "Order not found or you're not authorized to cancel this order." });
    }
    res.status(200).json({ message: "Order canceled successfully." });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: "Failed to cancel order." });
  }
};