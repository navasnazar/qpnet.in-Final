const smsConf = require('../config/smsVerification')
const client = require('twilio')(smsConf.accountSID, smsConf.authToken)

module.exports={

    otp:(mobNo)=>{
        return new Promise((resolve, reject)=>{
            client.verify
            .services(smsConf.serviceSID)
            .verifications.create({
            to: `+91${mobNo}`,
            channel: 'sms'
            })
            .then((resp)=>{
            userNumber = resp.to
            console.log('response',resp)
            resolve(resp)
            console.log('OTP successfully send')
            })
        })
    },
    otpVerification:(data)=>{
        return new Promise(async(resolve, reject)=>{
            let userNo = userNumber
            console.log('No :', userNo)
            console.log(data)
            const {otp} = data
            console.log('otp :',otp)
            client.verify
            .services(smsConf.serviceSID)
            .verificationChecks.create({
              to:userNo,
              code:otp
            }).then((resp)=>{
              console.log('otp resp', resp)
              resolve(resp)
            })

        })
    }
}
