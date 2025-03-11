const Food = require("../models/FoodModel");

//get all foods
exports.getFood = async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

//add food

exports.AddFood = async (req, res) => {
    try{
       const {name,ingrediants,category,price,imageUrl} = req.body;

       //validate required feilds
       if(!name || !ingrediants || !category || !price || !imageUrl){
        return res.status(400).json({success: false, error: "Please fill all the fields"});
       }
       //create a new food item
       const newfood = new Food({
        name,
        ingrediants,
        category,
        price,
        imageUrl
    });
       
        const savedfood = await newfood.save();

        return res.status(200).json({success: true, data: savedfood});


    }           
    catch(err){
        console.log('error is adding food',err);
        return res.status(400).json({success: false, error: err.message});
    }

}

exports.UpdateFood = async (req, res) => {
    try{    
        const foodId = req.params.id;

        const updatedfood ={
            name: req.body.name,
            ingrediants: req.body.ingrediants,
            category: req.body.category,
            price: req.body.price,
            imageUrl: req.body.imageUrl
        }
       
        const food = await Food.findByIdAndUpdate(foodId, updatedfood, {new: true});

        return res.status(200).json({message: "Food updated successfully", data: food});


        if(!updatedfood){
            return res.status(404).json({success: false, error: "Food not found"});
        }



    }
    catch(err){
        console.log('error is updating food',err);
        return res.status(400).json({success: false, error: err.message});
    }

}

exports.deleteFood = async(req,res)=>{
    try{
        const foodId = req.params.id;
        const food = await Food.findByIdAndDelete(foodId);

        if(!food){
            return res.status(404).json({message:"Food not found"});
        }

        return res.status(200).json({message:"Food deleted successfully"});

    }

    catch(err){
        console.log('error is deleting food',err);
        return res.status(400).json({message:"error in delete food", error: err.message});
    }
}
exports.viewOneFood = async(req,res)=>{
    try{
        const foodId = req.params.id;
        const food = await findById(foodId);

        if(!food){
            return res.status(404).json({message:"Food not found"});
        }

        return res.status(200).json({message:"Food found successfully", data: food});

    }

    catch(err){
        res.status(400).json({message:"error in view one food", error: err.message});
    }

}