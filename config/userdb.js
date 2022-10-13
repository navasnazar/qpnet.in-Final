const mongoose = require('mongoose'),
      Schema = mongoose.Schema

      const User = mongoose.model('User', {
        name: { type: String, required: true},
        email:{ type: String, required: true , index: { unique: true } },
        alemail: { type: String },
        mobileNo: { type: String, required: true , index: { unique: true } },
        password: { type: String, required: true },
        rePassword: { type: String, required: true },
        blockStatus: { type: Boolean },
        gender: { type: String },
        location: { type: String },
        profilePhoto: { type: String },
        address: { type: String },
        city:{ type: String },
        alMobile: { type: String },
        hintName: { type: String }

    });
 
    
    module.exports = User