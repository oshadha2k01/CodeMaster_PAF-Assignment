const Order = require("../../models/FoodManagement/OrderModel");

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('meals.food');
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('meals.food');
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { meals, totalprice, paymentMethod } = req.body;

        // Validate required fields
        if (!meals || !totalprice || !paymentMethod) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        const order = await Order.create({
            meals,
            totalprice,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update order
exports.updateOrder = async (req, res) => {
    try {
        const { meals, totalprice, paymentMethod, status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                meals,
                totalprice,
                paymentMethod,
                status
            },
            { new: true, runValidators: true }
        ).populate('meals.food');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};