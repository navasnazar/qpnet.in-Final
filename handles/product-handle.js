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
let coupondb = require('../config/coupondb')
const { AddOnResultContext } = require('twilio/lib/rest/api/v2010/account/recording/addOnResult')
let offerdb = require('../config/offerdb')

module.exports={

    addProduct:(product, prodFiles)=>{
        return new Promise(async(resolve, reject)=>{
            let response
            console.log(product)
            var new_product = new productdb({
                pname: product.pname,
                description: product.description,
                originalPrice: product.originalPrice,
                sellingPriceFirst: product.sellingPrice,
                sellingPrice: product.sellingPrice,
                offer: 0,
                category: product.category,
                subCategory: product.subCategory,
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
            })
        })
    },
    addCategory:(category, subCategory)=>{
        return new Promise(async(resolve, reject)=>{
           categorydb.findOne({Category:category}).then((res)=>{
            if(res){
                categorydb.updateOne({Category:category},
                    {
                        $push:{subCategory: subCategory}
                    }).then((response)=>{
                        resolve(response)
                    })  
                
            }else{
                    var new_category = new categorydb({
                        Category: category,
                        subCategory: subCategory,
                    })
                    new_category.save().then((response)=>{
                        resolve(response)
                    })
                }    
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
                resolve(categories)
            })
        })
    },
    findCategory1:()=>{
        return new Promise(async(resolve, reject)=>{
            await categorydb.find().then((result)=>{
                console.log(result);
                resolve(result)
            })
        })
    },
    findSubcategory:(category)=>{
        return new Promise(async(resolve, reject)=>{
           categorydb.findOne({Category:category.category}).then((res)=>{
            subCat = res.subCategory
            resolve(subCat)
           }).catch((e)=>{
            console.log(e);
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
                originalPrice: product.originalPrice,
                sellingPrice: product.sellingPrice,
                category: product.category,
                subCategory: product.subCategory,
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
            product = await productdb.findOne({_id:objectId(proId)})
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
                                    prodPrice: product[0].sellingPrice,
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
                        prodPrice: product[0].sellingPrice,
                        prodQty: qty,
                        prodCategory: product[0].category,
                        prodSize: product[0].size,
                        prodImageFront: product[0].imageFront,
                    }],
                    finalAmount:0,
                    couponOffer:0,
                    deliveryCost:0,
                    checkoutAmount:0
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
            console.log(product.quantity)
            if(qtyNow >= product.quantity && qty == 1){
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
                                prodPrice: product[0].sellingPrice,
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
                        prodPrice: product[0].sellingPrice,
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
    removeToWishlist:(userID, prodId)=>{
        return new Promise(async (resolve, reject)=>{
            await wishlistShema.updateOne({userId:userID},
            {
                $pull: {products: {prodId: prodId}}
            }).then(()=>{
                resolve()
            }).catch((e)=>{
                console.log(e);
            })
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
    addChAmt:(checkoutAmount, deliveryCost, finalAmount, userID, couponValue)=>{
        return new Promise(async (resolve, reject)=>{
            await cartShema.updateOne({userId:userID},
            {
                $set:{finalAmount: finalAmount, deliveryCost: deliveryCost, checkoutAmount: checkoutAmount, couponOffer: couponValue}
            }).then(()=>{
                resolve()
            }).catch((e)=>{
                console.log(e);
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
    },
    addCoupon:(coupon)=>{
        return new Promise(async(resolve, reject)=>{
            var new_coupon = new coupondb({
                couponId: coupon.couponId,
                offer: coupon.offer,
                minAmount: coupon.minAmount,
                maxAmount: coupon.maxAmount,
                actDate: coupon.actDate,
                endDate: coupon.endDate,
            })
            new_coupon.save().then((response)=>{
                resolve(response)
            })
        })
    },
    findCoupon:()=>{
        let coupons=[]
        return new Promise(async(resolve, reject)=>{
            coupondb.find().then((res)=>{
                coupons = res
                resolve(coupons)
            })
        })
    },
    deleteCoupon:(couponId)=>{
        return new Promise(async(resolve, reject)=>{
            await coupondb.deleteOne({_id:objectId(couponId)}).then(()=>{
                resolve()
            })
        })
    },
        applyCoupon:(userID, addCoupon, totalAmount)=>{
        let couponValidity = { couponErr:false, done:false, userErr:false, AmtErr: false, dateErr: false}
        let coupon ;
        return new Promise(async(resolve, reject)=>{
            await coupondb.findOne({couponId: addCoupon}).then((res)=>{
                console.log(res);
                coupon = res
                if(res){
                    coupondb.findOne({couponId: addCoupon, used_customers: {$elemMatch: {userId:userID}}}).then((result)=>{
                            console.log('XXXX',result);
                            if(result){
                                console.log("already used");
                                couponValidity.userErr = true;
                                resolve(couponValidity)

                            }else{
                                if(res.minAmount > totalAmount || res.maxAmount < totalAmount){
                                    console.log("total amount not match");
                                    couponValidity.AmtErr = true;
                                    resolve(couponValidity)

                                }else if(res.actDate > Date.now() || res.endDate < Date.now()){
                                    console.log("date not match");
                                    couponValidity.dateErr = true;
                                    resolve(couponValidity)
                                
                                }else{
                                    coupondb.updateOne({couponId: addCoupon},
                                        {
                                            $push: {used_customers: {userId: userID}}
        
                                        }).then((response)=>{
                                            coupon.done = true;
                                            console.log('hiiii', coupon.offer);
                                            resolve(coupon)
                                        })
                                }
                            }
                        })
                }else{
                    console.log('coupon not valid');
                    couponValidity.couponErr = true;
                    resolve(couponValidity)
                }
            })
        })
    },
    addOffer:(offer)=>{
        let validation = {alreadyUsed: false}
        return new Promise(async(resolve, reject)=>{
            offerdb.findOne({offerId:offer.offerId}).then((result)=>{
                if(result){
                    console.log('This offer already applied');
                    validation.alreadyUsed = true
                    resolve(validation)

                }else{
                    var new_offer = new offerdb(offer)
                    new_offer.save().then((response)=>{
                       
                        productdb.updateMany({category:offer.offerApply},
                            {$set:{offer: offer.offerValue}}).then((response)=>{
                                productdb.find({category:offer.offerApply}).then((res)=>{
                                    
                                    for(let i=0; i<res.length; i++){
                                        offerPrice = res[i].sellingPrice * offer.offerValue / 100
                                        productdb.updateOne({category:offer.offerApply, pname:res[i].pname},{
                                            $inc: {sellingPrice: -offerPrice }
                                        }).then(()=>{
                                            console.log('update Offer');
                                        })
                                    }
                                    resolve(response)
                                })
                        })
                    })
                }
            })
        })
    },
    findOffers:()=>{
        return new Promise(async(resolve, reject)=>{
            await offerdb.find().then((offers)=>{
                resolve(offers)
            })
        })
    },
    deleteOffer:(offerId)=>{
        return new Promise(async(resolve, reject)=>{
            offerdb.findOne({_id:objectId(offerId)}).then((result)=>{
                console.log(result);
                productdb.updateMany({category:result.offerApply},
                    {$set:{offer: 0}}).then((response)=>{
                        productdb.find({category:result.offerApply}).then((res)=>{
                            
                            for(let i=0; i<res.length; i++){
                                productdb.updateOne({category:result.offerApply, pname:res[i].pname},{
                                    $set: {sellingPrice: res[i].sellingPriceFirst }
                                }).then(()=>{
                                    offerdb.deleteOne({_id:objectId(offerId)}).then(()=>{
                                        console.log('delete Offer');
                                    })
                                })
                            }
                            resolve(response)
                        })
                })
            })
        })
    },
    finalAmountCal:(cartProd)=>{
        return new Promise((resolve, reject)=>{
            let finalAmount = 0
            for(let i=0;i<cartProd.length;i++){
              totalPrice = cartProd[i].prodQty * cartProd[i].prodPrice
              finalAmount += totalPrice
            }
            console.log(finalAmount);
            resolve(finalAmount)
          })
    }
}