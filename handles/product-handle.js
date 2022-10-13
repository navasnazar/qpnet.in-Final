const mongoose = require('mongoose')
var objectId=require('mongodb').ObjectId
var productdb = require('../config/productdb')
let upload = require('../handles/multer')
var cartdb = require('../config/cartdb')
var wishlistShema = require('../config/wishlistdb')
let Cart = require('../config/cart')
let cartModel = require('../config/cart-model')
let cartShema = require('../config/cartSchema')
const { TrustProductsEvaluationsContext } = require('twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEvaluations')
const { response } = require('../app')
let categorydb = require('../config/categorydb')



module.exports={

    addProduct:(product, prodFiles)=>{
        return new Promise(async(resolve, reject)=>{
            let response
            console.log(product)
            var new_product = new productdb({
                pname: product.pname,
                description: product.description,
                price: product.price,
                category: product.category,
                color: product.color,
                size: product.size,
                quantity: product.quantity,
                itemDetails: product.itemDetails,
                imageFront: prodFiles[0] && prodFiles[0].filename ? prodFiles[0].filename : "",
                imageTop: prodFiles[1] && prodFiles[1].filename ? prodFiles[1].filename : "",
                imageSide: prodFiles[2] && prodFiles[2].filename ? prodFiles[2].filename : ""

            })
            new_product.save().then((response)=>{
                resolve(response)
                // console.log(response)
            })
        })
    },
    addCategory:(catergory)=>{
        return new Promise(async(resolve, reject)=>{
            var new_category = new categorydb({
                Category: catergory
            })
            new_category.save().then((response)=>{
                resolve(response)
            })
        })
    },
    findCategory:()=>{
        let categories = []
        return new Promise(async(resolve, reject)=>{
            await categorydb.find().then((result)=>{
                for(let i=0; i<result.length; i++){
                    categories[i] = result[i].Category
                }
                console.log(categories);
                resolve(categories)
            })
        })
    },
    getProducts:()=>{
        return new Promise(async(resolve, reject)=>{
            let products = await productdb.find()
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise(async(resolve, reject)=>{
            productdb.remove({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProDetails:(id)=>{
        let product ={}
        return new Promise(async (resolve, reject)=>{
            product = await productdb.find({_id:objectId(id)})
                resolve(product)  
        })
    },
    updateProduct:(prodId, product)=>{
        return new Promise(async(resolve, reject)=>{
            productdb.updateOne({_id:objectId(prodId)},
            {$set:{
                pname: product.pname,
                description: product.description,
                price: product.price,
                category: product.category,
                color: product.color,
                size: product.size,
                quantity: product.quantity,
                itemDetails: product.itemDetails
                }
            }).then((response)=>{
                console.log(prodId)
                resolve(prodId)
            })
        })
    },
    updateImage:(prodId, prodFiles)=>{
        return new Promise(async(resolve, reject)=>{
            productdb.updateOne({_id:objectId(prodId)},
            {$set:{
                imageFront: prodFiles[0] && prodFiles[0].filename ? prodFiles[0].filename : "",
                imageTop: prodFiles[1] && prodFiles[1].filename ? prodFiles[1].filename : "",
                imageSide: prodFiles[2] && prodFiles[2].filename ? prodFiles[2].filename : ""
                }
            })
            .then((response)=>{
                resolve(response)
            })
        })
    },
    productDetails:(proId)=>{
        let product ={}
        return new Promise(async (resolve, reject)=>{
            product = await productdb.find({_id:objectId(proId)})
                resolve(product)  
        })
    },
    getSingleProduct:(prodId)=>{
        let product = {}
        return new Promise(async (resolve, reject)=>{
            product = await productdb.find({_id:objectId(prodId)})
                resolve(product)  
        })
    },
    addToCart2:(prodId, userId, product, qty)=>{
        return new Promise(async(resolve, reject)=>{
            let userCart = await cartShema.findOne({userId:userId})
            if(userCart){
                let sameProduct = await cartShema.findOne({userId:userId, 'products.prodId':prodId})
                if(sameProduct){
                    cartShema.updateOne({userId:userId, 'products.prodId':prodId},
                    {
                        $inc:{'products.$.prodQty': qty}
                    }).then((response)=>{
                        resolve(response)
                    })

                }else{
                    cartShema.updateOne({userId:userId},
                        {
                            $push:{
                                products: [{
                                    prodId: prodId,
                                    prodName: product[0].pname,
                                    prodPrice: product[0].price,
                                    prodQty: qty,
                                    prodCategory: product[0].category,
                                    prodSize: product[0].size,
                                    prodImageFront: product[0].imageFront,
                                }]
                            }
                        }).then((response)=>{
                            resolve(response)
        
                        })
                }
            }else{
                var cart_product = new cartShema({
                    userId: userId,
                    products: [{
                        prodId: prodId,
                        prodName: product[0].pname,
                        prodPrice: product[0].price,
                        prodQty: qty,
                        prodCategory: product[0].category,
                        prodSize: product[0].size,
                        prodImageFront: product[0].imageFront,
                    }],
                    checkoutAmount: 0
                })
                cart_product.save().then((response)=>{
                    resolve(response)
                })

            }
            
        })
    },
    getCart2:(userId)=>{
        let cartProd = true
        let userCart=[]
        return new Promise(async (resolve, reject)=>{
        userCart = await cartShema.find({userId: userId})
            if(userCart[0]){
                cartProd = userCart[0].products
                resolve(cartProd) 
            }else{
                cartProd = false
                resolve(cartProd) 
            }
        })
    },
    getCart3:(userId)=>{
        let userCart
        return new Promise(async (resolve, reject)=>{
        userCart = await cartShema.find({userId: userId})
            resolve(userCart)
        })
    },
    CartProdQtyChange:(userId, prodId, qty, qtyNow, product)=>{
        return new Promise(async (resolve, reject)=>{
            console.log(product[0].quantity)
            if(qtyNow >= product[0].quantity && qty == 1){
              console.log('out of stock')
                    let response={}
                    response.change = true
                    response.outOfStock = true
                    resolve(response)
              
            }else if(qtyNow<=0 && qty == -1){
                console.log('Below Zero is not possible')
                let response={}
                response.change = true
                response.qtyZeroErr = true
                resolve(response)
            }else{
                await cartShema.updateOne({userId:userId, 'products.prodId':prodId},
                {
                    $inc:{'products.$.prodQty': qty}
                }).then((response)=>{
                    response.change = true
                    resolve(response)
                })
            }
        })
    },
    deleteCartProd:(userId, prodId)=>{
        return new Promise(async (resolve, reject)=>{
            await cartShema.updateOne({userId:userId},
            {
                $pull: {products: {prodId: prodId}}
            }).then(()=>{
                resolve()
            })
        })
    },
    addToWishlist:(prodId, userId, product)=>{
        return new Promise(async(resolve, reject)=>{
            let userWishlist = await wishlistShema.findOne({userId:userId})
            if(userWishlist){
                wishlistShema.updateOne({userId:userId},
                    {
                        $push:{
                            products: [{
                                prodId: prodId,
                                prodName: product[0].pname,
                                prodPrice: product[0].price,
                                prodQty: 1,
                                prodCategory: product[0].category,
                                prodSize: product[0].size,
                                prodImageFront: product[0].imageFront,
                            }]
                        }
                    }).then((response)=>{
                        resolve(response)
                    })    
            }else{
                var cart_product = new wishlistShema({
                    userId: userId,
                    products: [{
                        prodId: prodId,
                        prodName: product[0].pname,
                        prodPrice: product[0].price,
                        prodQty: 1,
                        prodCategory: product[0].category,
                        prodSize: product[0].size,
                        prodImageFront: product[0].imageFront,
                    }]
                })
                cart_product.save().then((response)=>{
                    resolve(response)
                })

            }
            
        })
    },
    getWishlist:(userId)=>{
        let wishlistProd = true
        let userWishlist=[]
        return new Promise(async (resolve, reject)=>{
        userWishlist = await wishlistShema.find({userId: userId})
            if(userWishlist[0]){
                wishlistProd = userWishlist[0].products
                resolve(wishlistProd) 
            }else{
                wishlistProd = false
                resolve(wishlistProd) 
            }
        })
    },
    deleteWishlistProd:(userId, prodId)=>{
        return new Promise(async (resolve, reject)=>{
            await wishlistShema.updateOne({userId:userId},
            {
                $pull: {products: {prodId: prodId}}
            }).then(()=>{
                resolve()
            })
        })
    },
    addChAmt:(checkoutAmount, deliveryCost, finalAmount, userID)=>{
        return new Promise(async (resolve, reject)=>{
            await cartShema.updateOne({userId:userID},
            {
                $set:{finalAmount: finalAmount, deliveryCost: deliveryCost, checkoutAmount: checkoutAmount}
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    removeCartAfterOrder:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            await cartShema.deleteOne({userId:userId})
            .then(()=>{
                resolve()
            })
        })
    },
    stockArrangment:(cartProds)=>{
        console.log(cartProds);
        return new Promise(async(resolve, reject)=>{
            for(let i=0; i<cartProds.length; i++){
                productdb.updateMany({_id:objectId(cartProds[i].prodId)},
                {
                    $inc: {quantity : -cartProds[i].prodQty}
                }).catch((e)=>{
                    console.log('haii',e);
                })
            }
            resolve()
        })
    },
    stockArrangmentAdd:(orderProds)=>{
        return new Promise(async(resolve, reject)=>{
            for(let i=0; i<orderProds.length; i++){
                productdb.updateMany({_id:objectId(orderProds[i].prodId)},
                {
                    $inc: {quantity : orderProds[i].prodQty}
                }).catch((e)=>{
                    console.log('haii',e);
                })
            }
            resolve()
        })
    }
}