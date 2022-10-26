let dotenv = require('dotenv')
dotenv.config({ path: "config.env" })

const mongoose = require('mongoose'),
      Schema = mongoose.Schema

const URI = process.env.MONGO_URI

mongoose.connect(URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});










