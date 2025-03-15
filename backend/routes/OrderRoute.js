const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');

router.get('/orders',OrderController.getOrders);
router.get('/orders/:id',OrderController.viewOneOrder);
router.post('/orders',OrderController.addOrders);
router.put('/orders/:id',OrderController.updateOrder);
router.delete('/orders/:id',OrderController.deleteOrder);

module.exports = router;

