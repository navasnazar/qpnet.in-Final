const mongoose = require('mongoose'),
      Schema = mongoose.Schema

    const orderShema = mongoose.model('Order',{


        userId: {type: String},
        paymentId: {type: String},
        paymentStatus: {type: Boolean},
        checkoutAmount:{type: Number},
        paymentOption: {type: String},
        items: { },
        shippingAddressId: {type: String},
        shippingAddress: { },
        shippingCarrier: {type: String},
        shippingStatus: {type: String},
        orderBilled: {type: Boolean},
        orderConfirmed: {type: Boolean},
        orderDelivered: {type: Boolean},
        orderMonth: {type: Number},
        orderDate: {type: Date},

        })
    
    module.exports = orderShema