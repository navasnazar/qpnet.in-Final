const mongoose = require('mongoose'),
      Schema = mongoose.Schema

    const coupondb = mongoose.model('Coupon',{


        couponId: {type: String},
        offer:{type: Number},
        minAmount:{type: Number},
        maxAmount:{type: Number},
        actDate:{type: Date},
        endDate:{type: Date},
        used_customers:[{
                        userId : {type: String},
                        }],
        })
    
    module.exports = coupondb