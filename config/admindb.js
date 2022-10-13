const mongoose = require('mongoose'),
      Schema = mongoose.Schema


const Admin = mongoose.model('Admin', {
    username: { type: String, required: true},
    password: { type: String, required: true }
});

// const new_admin = new Admin({
//     username: 'admin123',
//     password: '123'
// }) 

// new_admin.save()

module.exports = Admin