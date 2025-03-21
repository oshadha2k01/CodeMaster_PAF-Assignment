const Food = require('../../models/FoodManagement/FoodModel');

// Get all foods
exports.getFood = async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json({ success: true, data: foods, count: foods.length });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Add food
exports.AddFood = async (req, res) => {
    try {
        const { name, ingrediants, category, price, imageUrl } = req.body;

        // Validate required fields
        if (!name || !ingrediants || !category || !price || !imageUrl) {
            return res.status(400).json({ success: false, error: "Please fill all the fields" });
        }

        // Create a new food item
        const newFood = new Food({
            name,
            ingrediants,
            category,
            price,
            imageUrl
        });

        const savedFood = await newFood.save();
        return res.status(201).json({ success: true, data: savedFood });

    } catch (err) {
        console.log('Error in adding food:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Update food
exports.UpdateFood = async (req, res) => {
    try {    
        const foodId = req.params.id;

        const updatedFood = {
            name: req.body.name,
            ingrediants: req.body.ingrediants,
            category: req.body.category,
            price: req.body.price,
            imageUrl: req.body.imageUrl
        };

        const food = await Food.findByIdAndUpdate(foodId, updatedFood, { new: true });

        if (!food) {
            return res.status(404).json({ success: false, error: "Food not found" });
        }

        return res.status(200).json({ success: true, message: "Food updated successfully", data: food });

    } catch (err) {
        console.log('Error in updating food:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Delete food
exports.deleteFood = async (req, res) => {
    try {
        const foodId = req.params.id;
        const food = await Food.findByIdAndDelete(foodId);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        return res.status(200).json({ success: true, message: "Food deleted successfully" });

    } catch (err) {
        console.log('Error in deleting food:', err);
        return res.status(500).json({ success: false, message: "Error in deleting food", error: err.message });
    }
};

// View one food
exports.viewOneFood = async (req, res) => {
    try {
        const foodId = req.params.id;
        const food = await Food.findById(foodId);  // FIXED: `Food.findById` instead of `findById`

        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        return res.status(200).json({ success: true, message: "Food found successfully", data: food });

    } catch (err) {
        console.log('Error in viewing one food:', err);
        return res.status(500).json({ success: false, message: "Error in viewing one food", error: err.message });
    }
};
