const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// CREATE
const createOrder = async (req, res) => {
  try {
    const { userId, items, notes } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const orderItems = items.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
      return {
        productId: product._id,
        productSnapshot: {
          name: product.name,
          category: product.category,
          image: product.image
        },
        quantity: item.quantity,
        price: product.price
      };
    });

    const total = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    const order = await Order.create({
      userId,
      userSnapshot: { name: user.name, email: user.email },
      items: orderItems,
      total,
      notes
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// READ ALL (Con aggregation)
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    const matchStage = {};
    if (status) matchStage.status = status;

    const orders = await Order.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },       {$skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            { $project: { name: 1, email: 1, role: 1 } }
          ]
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { userId: 0 } }
    ]);

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ ONE
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
    }
    res.json({ success: true, message: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};