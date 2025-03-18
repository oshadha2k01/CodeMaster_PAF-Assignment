const mongoose = require('mongoose');
const schema = mongoose.Schema;

const FoodSchema = new schema({

    name :{type : String , required : true},
    ingrediants :{type : [String] , required : true},
    category :{type : String ,enum:['foods','drinks'], required : true},
    price :{type : Number , required : true},
    imageUrl :{type : String , required : true},

},{
    timestamps:true
});
module.exports = mongoose.model('Food',FoodSchema);