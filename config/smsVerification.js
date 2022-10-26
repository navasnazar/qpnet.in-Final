let dotenv = require('dotenv')
dotenv.config({ path: "config.env" })

module.exports={

    serviceSID:process.env.serviceSID,
    accountSID:process.env.accountSID,
    authToken:process.env.authToken
}