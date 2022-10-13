const mongoose = require('mongoose'),
      Schema = mongoose.Schema


const URI = 'mongodb://localhost:27017/NaNaShoppi'

mongoose.connect(URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});










