const mongoose = require('mongoose'),
      Schema = mongoose.Schema

    const cartModel = mongoose.model('CartModel',{

        owner: {type: String},
        items : {
                item: {
                    prodId: {type: String},
                    prodName: {type: String},
                    prodPrice:{ type: Number},
                    prodCategory: {type: String},
                    prodSize: {type: String},
                    prodImageFront: {type: String },
                },
                qty: {type: Number},
                price: {type: Number}
        },
        totalQty: {type: Number},
        totalPrice: {type: Number},

        
        })

        module.exports= function Cart(oldCart){
            this.items = oldCart.items || {};
            this.totalQty = oldCart.totalQty || 0;
            this.totalPrice = oldCart.totalPrice || 0;
            this.add = function(item, id){
                console.log(item)
                console.log(id)
        
                let storedItem = this.items[id];
                if(!storedItem){
                    storedItem = this.items[id] = {item:item, qty:0, price:0}
                }
                storedItem.qty++;
                storedItem.price = storedItem.item.price * storedItem.qty
                this.totalQty++;
                this.totalPrice += storedItem.item.price;
            }
            this.generateArray = function(){
                var arr = [];
                for(var id in this.items){
                    arr.push(this.items[id])
                }
                return arr;
            }
        }
    
    module.exports = cartModel

    