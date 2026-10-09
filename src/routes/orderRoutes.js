const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

// Rutas base: /api/orders
router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:id')
  .get(getOrderById)
  .put(updateOrder)
  .delete(deleteOrder);

module.exports = router;