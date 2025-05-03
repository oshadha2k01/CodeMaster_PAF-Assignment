const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrderSchema = new Schema({

   
    date : {
        type: Date,
        default: Date.now
    },
    status : {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
        required: true
    },
    totalprice : {
        type: Number,
        required: true
    },
    meals : [{
        food: {type: Schema.Types.ObjectId, ref: "Food", required: true},
        quantity: {type: Number, required: true},
    }]
    

});

module.exports = mongoose.model('Order', OrderSchema);
