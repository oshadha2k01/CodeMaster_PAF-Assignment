const Order = require("../../models/FoodManagement/OrderModel");


exports.getOrders = async (req, res) => {
    try{
        const orders = await Order.find().populate({Path:"meals",model:"Food"});
        if (orders.length===0){
            return res.status(404).json({message:"No orders found"});
        }
        res.status(200).json({message:"Orders found successfully",data:orders});
    }
    catch(err){
        res.status(400).json({error:"error in getting orders"});
    }
}

exports.getOrderByid=async(req,res)=>{
    try{
        const id = req.params.id;
        const order = await Order.findById(id);
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
        const {userID,meals,quantity,status} = req.body;

        if(!userID ||!meals || !quantity || !status){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const newOrder = new Order({userID,meals,quantity,status});
        const savedOrder = await newOrder.save();
        return res.status(200).json({message:"Order added successfully",data:savedOrder});
    }
    catch{
        res.status(400).json({message:"error in adding order"});
    }
}

exports.updateOrder = async (req,res)=>{
    try{
        const orderId = req.params.id;
        const updatedOrder = req.body;
        const order = await Order.findByIdAndUpdate(orderId,updatedOrder,{new:true});
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        return res.status(200).json({message:"Order updated successfully",data:order});
    }
    catch{
        res.status(400).json({message:"error in updating order"});
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
    catch{
        return res.status(404).json({message:"error in deleting order"});
    }



}