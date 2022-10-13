const mongoose = require('mongoose'),
      Schema = mongoose.Schema

    const cart = mongoose.model('Cart',{


        userId: {type: String},
        prodId: {type: String},
        prodName: {type: String},
        prodPrice:{ type: Number},
        prodCategory: {type: String},
        prodSize: {type: String},
        // prodQuantity: {type: Number, required: true},
        prodImageFront: {type: String },
        })
    
    module.exports = cart