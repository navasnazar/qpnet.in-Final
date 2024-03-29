const mongoose = require('mongoose'),
      Schema = mongoose.Schema

      const Products = mongoose.model('Product', {
        pname: { type: String },
        description:{ type: String },
        originalPrice: { type: Number },
        sellingPriceFirst: { type: Number },
        sellingPrice: { type: Number },
        offer: { type: Number },
        category: { type: String },
        subCategory: { type: String },
        color: { type: String },
        size: { type: String },
        quantity: { type: Number },
        itemDetails: { type: String },
        imageFront: { type: String },
        imageTop: { type: String },
        imageSide: { type: String }
    });
 
    
    module.exports = Products