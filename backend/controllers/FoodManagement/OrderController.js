const Order = require("../../models/FoodManagement/OrderModel");


exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('meals.food');

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({ message: "Orders found successfully", data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message || "Error in getting orders" });
    }
};

exports.getOrderByid=async(req,res)=>{
    try{
        const id = req.params.id;
        const order = await Order.findById(id).populate('meals.food');
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        return res.status(200).json({message:"Order found successfully",data:order});
        }

        catch(err){
            res.status(400).json({error:"error in getting order"});
        }
    }

exports.addOrders = async (req,res)=>{
    try{
        const {meals, totalprice} = req.body;

        if(!meals || !totalprice){
            return res.status(400).json({message:"Please fill all the required fields"});
        }

        // Validate meals array structure
        if(!Array.isArray(meals) || meals.length === 0){
            return res.status(400).json({message:"Meals must be a non-empty array"});
        }

        // Validate each meal has required fields
        for(const meal of meals){
            if(!meal.food || typeof meal.quantity !== 'number'){
                return res.status(400).json({message:"Each meal must have food (ObjectId) and quantity (number)"});
            }
        }

        const newOrder = new Order({
            meals: meals.map(meal => ({
                food: meal.food,
                quantity: meal.quantity
            })),
            totalprice: Number(totalprice),
            status: "pending"
        });
        
        const savedOrder = await newOrder.save();
        return res.status(201).json({message:"Order added successfully",data:savedOrder});
    }
    catch(err){
        res.status(500).json({message:"Error in adding order", error: err.message});
    }
}

exports.updateOrder = async (req,res)=>{
    try{
        const orderId = req.params.id;
        const updatedOrder = req.body;
        const order = await Order.findByIdAndUpdate(orderId,updatedOrder,{new:true}).populate('meals.food');
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        return res.status(200).json({message:"Order updated successfully",data:order});
    }
    catch(err){
        res.status(500).json({message:"Error in updating order", error: err.message});
    }
}
exports.deleteOrder = async (req,res)=>{
    try{
        const orderId = req.params.id;
        const order = await Order.findByIdAndDelete(orderId);

        if(!order){
            return res.status(404).json({message:"Order not found"});  
        }

        return res.status(200).json({message:"Order deleted successfully"});
    }   
    catch(err){
        return res.status(500).json({message:"Error in deleting order", error: err.message});
    }
}