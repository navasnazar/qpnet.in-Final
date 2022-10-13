const mongoose = require('mongoose'),
      Schema = mongoose.Schema

    const addressShema = mongoose.model('Address',{


        userId: {type: String},
        address: [ 
            {
                name: {type: String},
                email: {type: String},
                mobile:{ type: Number},
                address: {type: String},
                landmark: {type: String},
                district: {type: String},
                city: {type: String},
                pincode:{ type: Number},
            }
        ]
        })
    
    module.exports = addressShema