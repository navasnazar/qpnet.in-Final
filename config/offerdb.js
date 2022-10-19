const mongoose = require('mongoose'),
      Schema = mongoose.Schema

    const offerdb = mongoose.model('Offer',{

        offerId: {type: String},
        offerValue: {type: Number},
        offerApply:{type: String},
        actDate:{type: Date},
        endDate:{type: Date},
        
        })
    
    module.exports = offerdb