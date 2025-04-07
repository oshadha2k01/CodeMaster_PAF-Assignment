const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrderSchema = new Schema({



    meals : {
        ref: "Food",
        type:String,
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
