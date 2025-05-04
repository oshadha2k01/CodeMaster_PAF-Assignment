const express = require('express');
const router = express.Router();

const OrderController = require('../../controllers/FoodManagement/OrderController');

// Get all orders
router.get('/', OrderController.getAllOrders);

// Get single order by ID
router.get('/:id', OrderController.getOrderById);

// Create new order
router.post('/', OrderController.createOrder);

// Update order
router.put('/:id', OrderController.updateOrder);

// Delete order
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;