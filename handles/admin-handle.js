const mongoose = require('mongoose')
const admindb = require('../config/admindb')

module.exports={

    doAdminLogin:(adminData)=>{
        return new Promise(async(resolve, reject)=>{
            let adminLoginStatus=false
            let response={}
            let admin= await admindb.findOne({username:adminData.username, password:adminData.password})
            if(admin){
                        console.log('login success')
                        response.admin=admin
                        response.status=true
                        resolve(response)
                  
            }else{
                console.log("login failed 2")
                resolve({status:false})
            }
        
        })
    }
}