const mongoose = require('mongoose'),
      Schema = mongoose.Schema

    const wishlistShema = mongoose.model('WishlistSchema',{


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
        ]
        })
    
    module.exports = wishlistShema


// const mongoose = require('mongoose'),
//       Schema = mongoose.Schema

//     const wishlist = mongoose.model('Wishlist',{
//         userId: {type: String},
//         prodId: {type: String},
//         prodName: {type: String},
//         prodPrice:{ type: Number},
//         prodCategory: {type: String},
//         prodSize: {type: String},
//         // prodQuantity: {type: Number, required: true},
//         prodImageFront: {type: String },
//         })
    
//     module.exports = wishlist