var express = require('express');
const multer = require('multer')
var router = express.Router();
let adminHandles = require('../handles/admin-handle')
let productHandles = require('../handles/product-handle')
let userHandles = require('../handles/user-handle')
let productdb = require('../config/productdb')
var objectId=require('mongodb').ObjectId
let upload = require('../handles/multer')
let downloads = require('../handles/downloads-handles')

let AdminSession;
let offers =[]

let verifyAdminLogin=(req,res,next)=>{
  AdminSession=req.session
  if(AdminSession.adminId){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

let validation={
    loginErr: false,
    appliedOffer : false
    }

/* GET home page. */
router.get('/', verifyAdminLogin, function(req, res, next) {
  productHandles.findCategory().then((categories)=>{
    res.render('admin/dashboard',{categories})
  })
});

router.get('/login',(req, res)=>{
  AdminSession=req.session
  if(AdminSession.adminId){
    res.redirect('/admin/')
  }else{
    if(validation){
      res.render('admin/admin-login',{validation})
      validation={
        loginErr: false
        }
    }
  }    
})

router.post('/login',(req,res)=>{

  adminHandles.doAdminLogin(req.body).then((response)=>{
    if(response.status){
      AdminSession=req.session
      AdminSession.adminId=req.body.username
      console.log(AdminSession.adminId)
      res.redirect('/admin')
    }else{
      console.log('Invalid Username or Password')
      validation.loginErr=true
      res.redirect('/admin/login')
    }
  })
})

router.get('/view-products',verifyAdminLogin, (req, res)=>{
  let subCat =[]
  productHandles.getProducts().then((products)=>{
    productHandles.findCategory().then((categories)=>{
      res.render('admin/view-products',{admin:true, products, categories, subCat})
    })
  })
})

router.post('/add-category',(req, res)=>{
  catergory = req.body.categoryName
  subCategory = req.body.subCategoryName
  productHandles.addCategory(catergory, subCategory).then(()=>{
    res.redirect('/admin/view-products')
  })
})

router.post('/chartView',(req, res)=>{
  productHandles.findCategory().then((categories)=>{
    userHandles.getAllSalesDetails(categories).then((allSalesProd)=>{
      res.send({categories, allSalesProd})
    })
  })
})

router.post('/chartViewBar',(req, res)=>{
  userHandles.getAllOrders().then((allOrders)=>{
    console.log(allOrders);
    res.send(allOrders)
  })
})

router.post('/findSubCategory',(req, res)=>{
  category = req.body
  productHandles.findSubcategory(category).then((subCat)=>{
    res.send(subCat)
  })
})


router.post('/add-products', upload.any(), (req, res)=>{
  productHandles.addProduct(req.body , req.files).then((response)=>{
    res.redirect('/admin/view-products')
  })
})

router.get('/delete-product/:id',verifyAdminLogin, (req, res)=>{
  let proId = req.params.id
  productHandles.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/view-products')
  })
})


router.get('/edit-pro:id', verifyAdminLogin, (req, res)=>{
  let id = req.params.id
  let subCat =[]
  console.log(id)
  productHandles.getProDetails(id).then((product)=>{
    productHandles.findCategory().then((categories)=>{
    console.log('product :', product)   
    res.render('admin/edit-pro',{product, categories, subCat})
    })
  })
})

router.post('/edit-pro:id',upload.any(), (req, res)=>{
  let prodId = req.params.id
  console.log(req.files.fieldname)
  if(req.files[1]){
    console.log('image field activated')
    productHandles.updateImage(prodId, req.files)
  }
  productHandles.updateProduct(prodId, req.body).then(()=>{
    res.redirect('/admin/view-products')
  })
})  


router.get('/view-users',verifyAdminLogin, (req, res)=>{
  userHandles.getAllUsers().then((users)=>{
    res.render('admin/view-users',{users})
  })
})

router.post('/block-user:id',(req, res)=>{
  let id = req.params.id
  console.log('Blocking user id: ',id)
  userHandles.blockUser(id).then(()=>{
    res.redirect('/admin/view-users')
  })
})

router.post('/unblock-user:id',(req, res)=>{
  let id = req.params.id
  console.log('unblocking user id: ',id)
  userHandles.unblockUser(id).then(()=>{
    res.redirect('/admin/view-users')
  })
})

router.get('/view-orders',verifyAdminLogin,(req, res)=>{
  userHandles.getAllOrders().then((allOrders)=>{
    res.render('admin/view-orders',{allOrders})
  })
})

router.post('/confirmOrder:id',(req, res)=>{
  orderId = req.params.id
  userHandles.confirmOrder(orderId).then(()=>{
    res.redirect('/admin/view-orders')
  })
})

router.post('/deliveredOrder:id',(req, res)=>{
  orderId = req.params.id
  userHandles.deliveredOrder(orderId).then(()=>{
    res.redirect('/admin/view-orders')
  })
})

router.post('/cancellOrder:id',(req, res)=>{
  orderId = req.params.id
    userHandles.getOrderProds(orderId).then((orderProds)=>{
      productHandles.stockArrangmentAdd(orderProds).then(()=>{
        userHandles.orderDeleteAdmin(orderId).then(()=>{
      res.redirect('/admin/view-orders')
      })
    })
  })
})

router.get('/OrderDetails:id',verifyAdminLogin,(req, res)=>{
  orderId = req.params.id
  userHandles.getSingleOrder(orderId).then((order)=>{
    let orderItems = order.items
    let orderAddress = order.shippingAddress[0]
    res.render('admin/view-orderDetails',{order, orderItems, orderAddress})
  })
})

router.get('/view-coupons',verifyAdminLogin, (req, res)=>{
  productHandles.findCoupon().then((coupons)=>{
    res.render('admin/view-coupons',{coupons})
  })
})

router.post('/add-coupon',(req, res)=>{
  coupon = req.body
  console.log(coupon);
  productHandles.addCoupon(coupon).then(()=>{
    res.redirect('/admin/view-coupons')
  })
})

router.post('/delete-coupon/:id',(req, res)=>{
  couponId = req.params.id
  productHandles.deleteCoupon(couponId).then(()=>{
    res.redirect('/admin/view-coupons')
  })
})

router.get('/view-offers',verifyAdminLogin, (req, res)=>{
  productHandles.findCategory().then((categories)=>{
    productHandles.findOffers().then((offers)=>{
      res.render('admin/view-offers',{offers, categories, validation, offers})
      validation.appliedOffer=false
    })
  })
})

router.post('/add-offer',(req, res)=>{
  offer = req.body
  console.log(offer);
  productHandles.addOffer(offer).then((result)=>{
    if(result.alreadyUsed){
      validation.appliedOffer=true
    res.redirect('/admin/view-offers')
    }
    res.redirect('/admin/view-offers')
  })
})

router.post('/delete-offer/:id',(req, res)=>{
  offerId = req.params.id
  console.log(offerId);
  productHandles.deleteOffer(offerId).then(()=>{
    res.redirect('/admin/view-offers')
  })
})

router.get('/downloads', verifyAdminLogin, (req, res)=>{
  res.render('admin/downloads')
})

router.post('/export_to_excel', downloads.OrderDetails)

router.get('/logout',(req,res)=>{
  session.destroy()
  res.redirect('/admin/login')
})

module.exports = router;
