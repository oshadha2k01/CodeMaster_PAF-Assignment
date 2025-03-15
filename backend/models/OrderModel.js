const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrderSchema = new schema({
    
    // user id, email should added after the customer model created
    /*userId : {
        type: schema.Types.ObjectId,
        ref: "Customer",
        required: true},
    Email:{
      type:schema.Types.ObjectId,
      ref:"Customer"
    },*/

    meals : {
        type: Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    quantity : {
        type: Number,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    },
    status : {
        type: String,
        default: "pending"
    },
    totalprice : {
        type: Number,
        required: true
    },

});

module.exports = mongoose.model('Order', OrderSchema);
