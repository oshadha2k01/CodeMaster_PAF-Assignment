const Order = require("../models/OrderModel");
const Food = require("../models/FoodModel");
const { use } = require("../routes/FoodRoutes");


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