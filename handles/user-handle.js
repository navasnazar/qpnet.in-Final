const mongoose = require('mongoose')
const userdb = require('../config/userdb')
const bcrypt = require('bcrypt')
const { response } = require('../app')
var objectId=require('mongodb').ObjectId
let addressdb = require('../config/addressdb')
let ordersdb = require('../config/ordersdb')



module.exports={
    doSignup:(userData)=>{
        let passwordErr = false
        let response = {}
        return new Promise(async(resolve, reject)=>{
            if(userData.password == userData.rePassword){
                userData.password= await bcrypt.hash(userData.password,10),
                userData.rePassword= await bcrypt.hash(userData.rePassword,10)
                let userEmail = userData.email
                console.log('password matching..')
                console.log(userEmail)
                let response = {}

                userdb.findOne({email:userEmail}).then((user)=>{
                    if(user){
                        user.status = true
                        console.log('email already exist..')
                        resolve(user)

                    }else{
                        var new_user = new userdb({
                            name: userData.name,
                            email: userData.email,
                            mobileNo: userData.mobileNo,
                            password: userData.password,
                            rePassword: userData.rePassword,
                            blockStatus: false,

                        })
                        new_user.save().then((response)=>{
                            resolve(response)
                        })
                    }
                })
            }else{
                response.passwordErr=true
                resolve(response)
            }         
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve, reject)=>{
            let response = {
                userStatus: false,
                blockStatus: false,
                notRegiseter: false
                }
            console.log(userData.username)
            let user = await userdb.findOne({email: userData.username})
            if(!user){
                response.notRegiseter=true
                resolve(response)
            }else{
                if(user.blockStatus){
                    response.blockStatus=true
                    resolve(response)
                }else{
                    bcrypt.compare(userData.password, user.password).then((status)=>{
                        if(status){
                            console.log('login success')
                            response.userStatus=true
                            resolve(response)
                        }else{
                            console.log('login failed haii')
                            response.userStatus=false
                            resolve(response)
                        }
                    })
                }  
            }
        })
    },

    mobNoChecking:(mobNo)=>{
        return new Promise(async (resolve, reject)=>{
            let response ={}
            let blockStatus = false
            userdb.findOne({mobileNo: mobNo}).then((status)=>{
                if(!status){
                    resolve({status:false})
                    console.log('This Mobile Number Not Registered')
                }else{
                    if(status.blockStatus){
                        response.blockStatus= true
                        resolve(response)
                    }else{
                        response.status = true
                        resolve(response)
                    } 
                }
            })
        })
    },
    mobNoCheckingSignup:(mobNo)=>{
        return new Promise(async (resolve, reject)=>{
            let notUser = true
            let response ={}
            userdb.findOne({mobileNo: mobNo}).then((status)=>{
                console.log(status)
                if(status){
                    response.status = true
                    resolve(response)
                }else{
                    resolve({status:false})
                    
                }
                
                
                
            })
        })
    },

    getAllUsers:()=>{
        return new Promise(async(resolve, reject)=>{
            let users = await userdb.find()
            resolve(users)
        })
        
    },

    blockUser:(id)=>{
        return new Promise(async(resolve, reject)=>{
            userdb.updateOne({_id:objectId(id)},
            {$set:{
                blockStatus: true
                }
            }).then((response)=>{
                resolve()
            })
        })
    },

    unblockUser:(id)=>{
        return new Promise(async(resolve, reject)=>{
            userdb.updateOne({_id:objectId(id)},
            {$set:{
                blockStatus: false
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    addUserAddress:(userId, address)=>{
        return new Promise(async (resolve, reject)=>{
            addressdb.findOne({userId:userId}).then(()=>{
                addressdb.updateOne({userId:userId},
                    {
                        $push:{
                            address: [{
                                    name: address.name,
                                    email: address.email,
                                    mobile: address.mobile,
                                    address: address.address,
                                    landmark: address.landmark,
                                    district: address.district,
                                    city: address.city,
                                    pincode: address.pincode,
                                }]
                        }
                    }).then((response)=>{
                        resolve(response)
                    })  
            }).catch(()=>{
                var user_address = new addressdb({
                    userId: userId,
                    address: [ 
                        {
                            name: address.name,
                            email: address.email,
                            mobile: address.mobile,
                            address: address.address,
                            landmark: address.landmark,
                            district: address.district,
                            city: address.city,
                            pincode: address.pincode,
                        }
                    ]
                })
                user_address.save().then(()=>{
                    resolve()
                })
            })
        })
    },
    getUserAddress:(userId)=>{
        let address = true
        let userAddress=[]
        return new Promise(async (resolve, reject)=>{
        userAddress = await addressdb.find({userId:userId})
            if(userAddress[0]){
                address = userAddress[0].address
                resolve(address) 
            }else{
                address = false
                resolve(address) 
            }
        })
    },
    deleteAddress:(AddId, userId)=>{
        return new Promise(async (resolve, reject)=>{
            await addressdb.updateOne({userId:userId},
            {
                $pull: {address: {_id:objectId(AddId)}}
            }).then(()=>{
                resolve()
            })
        })
    },
    findAddress:(userId, addressId)=>{
        console.log(userId, addressId)
        let billAddress
        return new Promise(async (resolve, reject)=>{
            addressdb.findOne({userId: userId}).then((userAdd)=>{
                let userAddress = userAdd.address
                billAddress = userAddress.filter((address) => {
                    return addressId.includes(address._id)
                })
            }).then((result)=>{
                console.log(billAddress)
                resolve(billAddress)
            })
        })
    },
    addOrders:(userId, paymentOption, billAddress, cartProds, addressId, ChOutAmnt)=>{
        console.log(ChOutAmnt)
        return new Promise(async(resolve, reject)=>{
        orderDetails = new ordersdb({
        userId: userId,
        paymentId: 123,
        paymentStatus: false,
        checkoutAmount: ChOutAmnt,
        paymentOption: paymentOption,
        items: cartProds ,
        shippingAddressId: addressId,
        shippingAddress: billAddress,
        shippingCarrier: 'abc',
        shippingStatus: 'billed',
        orderBilled: true,
        orderConfirmed: false,
        orderDelivered: false,
        orderDate: Date.now()
        })

        orderDetails.save().then((res)=>{
            orId = res._id
            orderId = objectId(orId)
            console.log(orderId)
            resolve(orderId)
        })
        })
    },
    getOrderDetails:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            await ordersdb.find({userId:userId})
            .then((result)=>{
                let orders = result
                resolve(orders)
            })
        })
    },
    getSingleOrder:(orderId)=>{
        return new Promise(async(resolve, reject)=>{
            await ordersdb.find({_id:objectId(orderId)})
            .then((result)=>{
                let order = result[0]
                resolve(order)
            })
        })
    },
    orderDelete:(userId, orderId)=>{
        return new Promise(async(resolve, reject)=>{
            await ordersdb.deleteOne({userId:userId, _id:objectId(orderId)})
            .then(()=>{
                resolve()
            })
        })
    },
    getAllOrders:()=>{
        return new Promise(async(resolve, reject)=>{
            await ordersdb.find().then((allOrders)=>{
                resolve(allOrders)
            })
        })
    },
    confirmOrder:async (orderId)=>{
        await new Promise(async (resolve, reject) => {
            ordersdb.updateOne({ _id: objectId(orderId)},
                { $set: { shippingStatus: 'confirmed',orderBilled:false, orderConfirmed:true} })
                .then(()=>{
                    resolve()
                })
        })
    },
    deliveredOrder:async (orderId)=>{
        await new Promise(async (resolve, reject) => {
            ordersdb.updateOne({ _id: objectId(orderId)},
                { $set: { shippingStatus: 'Delivered',orderBilled:false, orderConfirmed:false, orderDelivered:true} })
                .then(()=>{
                    resolve()
                })
        })
    },
    orderDeleteAdmin:(orderId)=>{
        return new Promise(async(resolve, reject)=>{
            await ordersdb.deleteOne({_id:objectId(orderId)})
            .then(()=>{
                resolve()
            })
        })
    },
    getOrderProds:(orderId)=>{
        let orderProds = true
        let userOrder=[]
        return new Promise(async (resolve, reject)=>{
            userOrder = await ordersdb.find({_id:objectId(orderId)})
            if(userOrder[0]){
                orderProds = userOrder[0].items
                resolve(orderProds) 
            }else{
                orderProds = false
                resolve(orderProds) 
            }
        })
    },
    getUserDetails:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            await userdb.find({email:userId}).then((userDetails)=>{
                resolve(userDetails)
            })
        })
    },
    updateProfile:(profile, userId)=>{
        return new Promise(async(resolve, reject)=>{
            await userdb.updateOne({email:userId},
                {$set: 
                    {
                        name: profile.name,
                        alemail: profile.alemail,
                        mobileNo: profile.mobileNo,
                        gender: profile.gender,
                        location: profile.location,
                        profilePhoto: profile.profilePhoto,
                        address: profile.address,
                        city: profile.city,
                        alMobile: profile.alMobile,
                        hintName: profile.hintName
                    }
                })
                .then(()=>{
                    resolve()
            })
        })
    }
}