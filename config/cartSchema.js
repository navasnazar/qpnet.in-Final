const mongoose = require('mongoose'),
      Schema = mongoose.Schema

    const cartShema = mongoose.model('CartSchema',{


        userId: {type: String},
        products: [ 
            {
                prodId: {type: String},
                prodName: {type: String},
                prodPrice:{ type: Number},
                prodQty:{ type: Number},
                prodCategory: {type: String},
                prodSize: {type: String},
                prodImageFront: {type: String }
            }
        ],
        finalAmount:{type: Number},
        couponOffer:{type: Number},
        deliveryCost:{type: Number},
        checkoutAmount:{type: Number},
        })
    
    module.exports = cartShema