const mongoose = require('mongoose'),
      Schema = mongoose.Schema

      const Category = mongoose.model('Category', {
        Category: { type: String },
        subCategory: [{ type: String }],

        
    });
 
    
    module.exports = Category