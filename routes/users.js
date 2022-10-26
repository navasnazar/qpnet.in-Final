var express = require('express');
const { response } = require('../app');
var router = express.Router();
const userHandles= require('../handles/user-handle')
const productHandles = require('../handles/product-handle')
const otpHandles= require('../handles/otp')
const bodyParser = require('body-parser')
var objectId=require('mongodb').ObjectId
let payhelper = require('../handles/payment-Handles')

let validation = 
  { blockErr: false,
    userErr: false,
    passwordErr: false,
    mobileErr: false,
    otpErr: false,
    matchPassErr: false,
    wishMsg: false,
    outOfStock: false,
    qtyZeroErr: false,
    couponErr: false,
    couponUserErr: false,
    couponAmtErr: false,
    couponDateErr: false,
    cartEmpty: false,
  }

let couponValue = 0; 
let deliveryCost = 0;
let login ={user: false, guest: false}

let sessions;
const verifyLogin=(req,res,next)=>{
  sessions=req.session
  if(sessions.userid){
    next()
  }else{
    res.redirect('/login')
  }
}

    
/* GET users listing. */

router.get('/',(req, res)=>{
  sessions=req.session
  if(sessions.userid){
    productHandles.getProducts().then((products)=>{
      userID = sessions.userid
      productHandles.getCart2(userID).then((cartProd)=>{
      login.user = true
      res.render('index',{login, products, cartProd})
      login.user = false

      })
    })
  }else{
    productHandles.getProducts().then((products)=>{
      login.guest = true
      res.render('index',{login, products })
      login.guest = false

    })
  }
})

router.get('/login',(req, res)=>{
  sessions=req.session
  if(sessions.userid){
    res.redirect('/')
  }else{
    if(validation){
      res.render('user/user-login',{validation})
      validation = 
        { blockErr: false,
          userErr: false,
          passwordErr: false,
          mobileErr: false,
          otpErr: false
        }
    }
  }  
})

router.post('/login',(req, res)=>{
  sessions=req.session
  console.log('Mob Number', req.body.mobileNo)
  let mobNo = req.body.mobileNo
  sessions.mobNo = mobNo
  if(mobNo){
    userHandles.mobNoChecking(mobNo).then((response)=>{
      if(response.blockStatus){
        validation.blockErr = true 
        console.log('user is blocked list')
        res.redirect('/login')
      }
      else if(response.status){
        otpHandles.otp(mobNo).then((resp)=>{
          let userNumber = resp.to
          res.render('user/otp',{resp, userNumber})
        })
      }else{
        validation.mobileErr=true
        console.log('user does not exist')
        res.redirect('/login')
      }
    }) 
  }else{
    userHandles.doLogin(req.body).then((response)=>{
      if(response.blockStatus){
        validation.blockErr = true 
        console.log('user is blocked list')
        res.redirect('/login')
      }else if(response.userStatus){
        console.log('user login Success')
        sessions=req.session
        sessions.userid=req.body.username
        user = true
        res.redirect('/')
      }else if(response.notRegiseter){
        validation.userErr=true
        console.log('user not registered')
        res.redirect('/login')
      }else{
        validation.passwordErr=true
        console.log('password is incorrect')
        res.redirect('/login')
      }
    })
  } 
})


router.post('/otp', (req, res)=>{
  otpHandles.otpVerification(req.body).then((resp)=>{
    if(resp.valid){
      mobNo = sessions.mobNo
      userHandles.userFindwithMob(mobNo).then((response)=>{
        if(response.email){
          req.session.userid = response.email
          sessions.mobNo = ""
          res.redirect('/')
        }else{
          res.redirect('/')
        }
      })
    }else{
      console.log('incorrect OTP')
      validation.otpErr=true
      res.redirect('/login')
    }
  })
})

router.get('/product:id', (req, res)=>{
  sessions=req.session
  if(sessions.userid){
    login.user = true
    proId = req.params.id
    productHandles.productDetails(proId).then((product)=>{
      productHandles.getProducts().then((Allproducts)=>{
        productHandles.getCart2(userID).then((cartProd)=>{
          if(validation){
          res.render('user/product',{login,product,Allproducts, cartProd, validation})
            validation = 
            { wishMsg : false, qtyZeroErr : false }
          }
        login.user = false
        })
      })
    })
  }else{
    login.guest = true
    proId = req.params.id
    productHandles.productDetails(proId).then((product)=>{
      productHandles.getProducts().then((Allproducts)=>{
          if(validation){
          res.render('user/product',{login, product,Allproducts, validation})
            validation = 
            { wishMsg : false, qtyZeroErr : false }
          }
        login.guest = false
      })
    })
  }
  })


router.get('/signup',(req, res)=>{
  sessions=req.session
  if(sessions.userid){
    res.redirect('/')   
  }else{
    if(validation){
      res.render('user/user-register',{validation})
      validation = 
        { userErr: false,
          mobileErr: false,
          matchPassErr:false
        }
    }
  }
})


router.post('/signup',(req, res)=>{
  let mobNo = req.body.mobileNo
  if(mobNo){
    userHandles.mobNoCheckingSignup(mobNo).then((response)=>{
      if(!response.status){
        userHandles.doSignup(req.body).then((user)=>{
          if(user.passwordErr){
            validation.matchPassErr=true
            res.redirect('/signup')
          }else if(user.status){
            validation.userErr=true
            console.log('user email ID already exist')
            res.redirect('/signup')
          }else{
            otpHandles.otp(mobNo).then((resp)=>{
              let userNumber = resp.to
              res.render('user/otp',{resp, userNumber})
            })
          }
        })
      }else{
        validation.mobileErr=true
        console.log('user mobile number already exist')
        res.redirect('/signup')
      }
    })
  }
})

router.post('/addToCart:id',verifyLogin,(req, res)=>{
  qty = (req.body.quantity)
  if(!qty){
    qty=1
  }
  prodId = req.params.id
  userID = sessions.userid
  productHandles.getProDetails(prodId).then((product)=>{
    productHandles.addToCart2(prodId, userID, product, qty).then(()=>{
      res.redirect('/')
    })
  }) 
})

router.post('/addToWish:id',verifyLogin,(req, res)=>{
  prodId = req.params.id
  userID = sessions.userid
  productHandles.getProDetails(prodId).then((product)=>{
    productHandles.addToWishlist(prodId, userID, product).then(()=>{
      res.redirect('/')
    })
  }) 
})


router.get('/shop',(req, res)=>{
  sessions=req.session
  if(sessions.userid){
    login.user = true
    productHandles.getProducts().then((products)=>{
      userID = sessions.userid
      productHandles.getCart2(userID).then((cartProd)=>{
      res.render('user/shop-view',{login, products, cartProd})
      login.user = false
      })
    })
  }else{
    login.guest = true
    productHandles.getProducts().then((products)=>{
      res.render('user/shop-view',{login, products})
      login.guest = false
    })
  }
})

router.get('/cart', verifyLogin,(req, res)=>{
  console.log(couponValue);
  userID = sessions.userid
    productHandles.getCart2(userID).then((cartProd)=>{
      productHandles.finalAmountCal(cartProd).then((finalAmount)=>{
        if(cartProd.length != 0){
        deliveryCost = 50;
        }else{
        deliveryCost = 0;
        }
        var checkoutAmount = finalAmount+deliveryCost-couponValue;
        let cartLength = cartProd.length
        console.log('chq amnt:',checkoutAmount);
        productHandles.addChAmt(checkoutAmount, deliveryCost, finalAmount, userID, couponValue).then(()=>{
          res.render('user/cart',{cartProd, userID, finalAmount, deliveryCost, checkoutAmount, cartLength, validation, couponValue})
          validation = { outOfStock: false, }
          couponValue = 0;
        }).catch((e)=>{
          console.log('ERR',e);
        })
      })
    })
})


router.get('/wishlist',verifyLogin, (req, res)=>{
  userID = sessions.userid
  productHandles.getCart2(userID).then((cartProd)=>{
    productHandles.getWishlist(userID).then((wishProd)=>{
        res.render('user/wishlist',{cartProd, wishProd})
      })
  })
})

router.post('/removetoWishlist:id',(req, res)=>{
  prodId = req.params.id
  userID = sessions.userid
  console.log(prodId);
  productHandles.removeToWishlist(userID, prodId).then(()=>{
    res.redirect('/wishlist')
  })
})


router.post('/applycoupon',(req, res)=>{
  userID = sessions.userid
  couponId = req.body.res
  totalAmount = req.body.totalAmount
  productHandles.applyCoupon(userID, couponId, totalAmount).then((response)=>{
    if(response.couponErr){
      response.change=true
      validation.couponErr=true;
      res.send(response)
    }else if(response.userErr){
      response.change=true
      validation.couponUserErr=true;
      res.send(response)
    }else if(response.AmtErr){
      response.change=true
      validation.couponAmtErr=true;
      res.send(response)
    }else if(response.dateErr){
      response.change=true
      validation.couponDateErr=true;
      res.send(response)
    }else if(response.done){
      couponValue = response.offer
      console.log('tttt',couponValue)
      response.change=true
      res.send(response)
    }
  })
})


router.post('/moveToCart:id',verifyLogin,(req, res)=>{
  userId = sessions.userid
  prodId = req.params.id
  productHandles.getSingleProduct(prodId).then((product)=>{
    let qty =1
    productHandles.addToCart2(prodId, userId, product, qty).then(()=>{
      productHandles.deleteWishlistProd(userId, prodId).then(()=>{
        res.redirect('/wishlist')
      })
    })
  })
})

router.post('/changeQuantity', (req, res)=>{
  userId = req.body.user
  prodId = req.body.product
  qty = req.body.count
  qtyNow = req.body.qtyNow
  productHandles.productDetails(prodId).then((product)=>{
      productHandles.CartProdQtyChange(userId, prodId, qty, qtyNow, product).then((response)=>{
        if(response.outOfStock){
          validation.outOfStock=true
        }else if(response.qtyZeroErr){
          validation.qtyZeroErr=true
        }
        res.send(response)
      })
  })
})   

router.post('/deleteCart:id',(req, res)=>{
  userId = sessions.userid
  prodId = req.params.id
  productHandles.deleteCartProd(userId, prodId).then(()=>{
    res.redirect('/cart')
  })
})

router.get('/address',verifyLogin, (req, res)=>{
  userId = sessions.userid
  productHandles.getCart2(userId).then((cartProd)=>{
    productHandles.getCart3(userId).then((userCart)=>{
      userHandles.getUserAddress(userId).then((address)=>{
        let cartLength = cartProd.length
        if(cartLength == 0){
          deliveryCost = 0;
          validation.cartEmpty = true
        res.redirect('/cart')
        }else{
          validation.cartEmpty = false
          res.render('user/address',{cartProd, userCart, address, cartLength})
        }
      })
    }) 
  })
})

router.post('/addAddress',(req, res)=>{
  userId = sessions.userid
  address = req.body
  userHandles.addUserAddress(userId, address).then(()=>{
    res.redirect('/address')
  })
})

router.post('/addAddressDashboard',(req, res)=>{
  userId = sessions.userid
  address = req.body
  userHandles.addUserAddress(userId, address).then(()=>{
    res.redirect('/user_dashboard')
  })
})

router.get('/deleteAddress:id', (req, res)=>{
  AddId = req.params.id
  userId = sessions.userid
  userHandles.deleteAddress(AddId, userId).then(()=>{
    res.redirect('/address')
  })
})

router.get('/deleteAddDash:id', (req, res)=>{
  AddId = req.params.id
  console.log(AddId);
  userId = sessions.userid
  userHandles.deleteAddress(AddId, userId).then(()=>{
    res.redirect('/user_dashboard')
  })
})

router.post('/payment',(req, res)=>{
  addressId = req.body.radio
  userId = sessions.userid
  productHandles.getCart2(userId).then((cartProd)=>{
    productHandles.getCart3(userId).then((userCart)=>{
      let cartLength = cartProd.length
      res.render('user/payment',{cartProd, userCart, addressId, cartLength})
    }) 
  })
})

router.post('/placeOrder',(req, res)=>{
  userId = sessions.userid

  productHandles.getCart3(userId).then((userCart)=>{
    let ChOutAmnt = userCart[0].checkoutAmount

  if (req.body["paymentMethod"] === "cod") {
    res.json({ codSuccess: true });
  } else if (req.body["paymentMethod"] === "razorpay") {
    console.log("generating rasorpay");
    payhelper.generateRazorpay(ChOutAmnt).then((order) => {
      console.log(order);
      res.json({ order, razorpay: true });
    });
  } else if (req.body["paymentMethod"] === "paypal") {
    console.log("working on generating the paypal");
    const orderid = 123456;
    res.json({ChOutAmnt, orderid, paypal: true});
  }
  })
})

router.post('/paypal_payment',(req, res)=>{
  totalPrice = req.body.totalPrice
  orderId = req.body.orderId
  payhelper.paypalPayment(totalPrice, orderId).then((payment)=>{
    {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ forwardLink: payment.links[i].href });
        }
      }
    }
  })
})


router.get('/OrderPaymentSucess', verifyLogin, (req, res)=>{
  paymentOption = req.query.id
  userId = sessions.userid

  userHandles.findAddress(userId, addressId).then((billAddress)=>{
    productHandles.getCart2(userId).then((cartProds)=>{
      productHandles.getCart3(userId).then((userCart)=>{
        let ChOutAmnt = userCart[0].checkoutAmount
        userHandles.addOrders(userId, paymentOption, billAddress, cartProds, addressId, ChOutAmnt).then((orderId)=>{
          productHandles.stockArrangment(cartProds).then(()=>{
            productHandles.removeCartAfterOrder(userId).then(()=>{
              productHandles.getCart2(userId).then((cartProd)=>{
                res.render('user/order_success',{cartProd, orderId})
              })
            })
          })
        })
      })
    })
  })
})

router.get('/orders',verifyLogin,(req, res)=>{
  userId = sessions.userid
  productHandles.getCart2(userId).then((cartProd)=>{
    userHandles.getOrderDetails(userId).then((orders)=>{
      res.render('user/orderlist',{cartProd, orders})
    })
  })
})

router.get('/orderDetails:id',(req, res)=>{
  orderId = req.params.id
  userId = sessions.userid

  productHandles.getCart2(userId).then((cartProd)=>{
    userHandles.getSingleOrder(orderId).then((order)=>{
      let orderItems = order.items
      let orderAddress = order.shippingAddress[0]
      res.render('user/orderDetails',{cartProd, order, orderItems, orderAddress})
    })
  })
})

router.post('/orderDelete:id',(req, res)=>{
  userId = sessions.userid
  orderId = req.params.id
  userHandles.getOrderProds(orderId).then((orderProds)=>{
    productHandles.stockArrangmentAdd(orderProds).then(()=>{
      userHandles.orderDelete(userId, orderId).then(()=>{
        res.redirect('/orders')
      })
    })
  })
})

router.get('/user_dashboard',(req, res)=>{
  userId = sessions.userid
  productHandles.getCart2(userId).then((cartProd)=>{
    userHandles.getUserDetails(userId).then((userDetails)=>{
      userHandles.getUserAddress(userId).then((address)=>{
        res.render('user/user-dashboard',{cartProd, userDetails, address})
      })
    })
  })
})

router.post('/saveProfile',(req, res)=>{
  userId = sessions.userid
  profile = req.body
  userHandles.updateProfile(profile, userId).then(()=>{
    res.redirect('/user_dashboard')
  })
})


router.get('/logout',(req,res)=>{
  req.session.userid= ""
  res.redirect('/login')
})


module.exports = router;
