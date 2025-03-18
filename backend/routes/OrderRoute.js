const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController.js');

router.get('/',OrderController.getOrders);
router.get('/:id',OrderController.getOrderByid);
router.post('/',OrderController.addOrders);
router.put('/:id',OrderController.updateOrder);
router.delete('/:id',OrderController.deleteOrder);

module.exports = router;