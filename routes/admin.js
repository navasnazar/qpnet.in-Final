var express = require('express');
const multer = require('multer')
var router = express.Router();
let adminHandles = require('../handles/admin-handle')
let productHandles = require('../handles/product-handle')
let userHandles = require('../handles/user-handle')
let productdb = require('../config/productdb')
var objectId=require('mongodb').ObjectId
let upload = require('../handles/multer')

let AdminSession;
let verifyAdminLogin=(req,res,next)=>{
  AdminSession=req.session
  if(AdminSession.adminId){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

let validation={
    loginErr: false
    }

/* GET home page. */
router.get('/', verifyAdminLogin, function(req, res, next) {
  res.render('admin/dashboard');
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
  productHandles.getProducts().then((products)=>{
    productHandles.findCategory().then((categories)=>{
      res.render('admin/view-products',{admin:true, products, categories})
    })
  })
})

router.post('/add-category',(req, res)=>{
  catergory = req.body.categoryName
  console.log(catergory)
  productHandles.addCategory(catergory).then(()=>{
    res.redirect('/admin/view-products')
  })
})


router.post('/add-products', upload.any(), (req, res)=>{
  console.log(req.files)
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
  console.log(id)
  productHandles.getProDetails(id).then((product)=>{
    productHandles.findCategory().then((categories)=>{
    console.log('product :', product)   
    res.render('admin/edit-pro',{product, categories})
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

router.get('/logout',(req,res)=>{
  session.destroy()
  res.redirect('/admin/login')
})

module.exports = router;
