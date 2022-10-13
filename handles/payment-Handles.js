const { json } = require('express');
const Razorpay = require('razorpay');
const paypal = require("paypal-rest-sdk");
var instance = new Razorpay({
    key_id: "rzp_test_8uymMw1v38kcUM",
    key_secret:"u82JgOpccupY7OdxN3J1h6Wr",
  });

  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
      "AV2IS8UD2hV0TbWv1woYjYhNwDSUpQTGMrCelCqQUqD8uA0UMkDN1NYtXYMWSNCeX08GWFLzqCQ2tRBd",
    client_secret:
      "ENHGkTBSGOgUe0Qz7zhIEMdJIzlfOQXFtu8gnvEDf1_SH_zbOJR5eglAwm1i0779Yj3fkh3SweJ0robr",
  });

module.exports = {
    

  generateRazorpay: (totalAmount) => {
    orderid=1234567
    return new Promise((res, rej) => {
      console.log("amount is " + totalAmount);

      var options = {
        amount: totalAmount *100, 
        currency: "INR",
        receipt:orderid
      };
 
      console.log("options"+ options)
      instance.orders.create(options, function(err, order) {
        if(err){
          console.log(err)
        }else{
         
           console.log(order);
         res(order)
        }
    })
    })
  },

  paypalPayment:(totalPrice, orderId)=>{
    return new Promise(async(resolve, reject)=>{
        const create_payment_json = {
            intent: "sale",
            payer: {
              payment_method: "paypal",
            },
            redirect_urls: {
              return_url: "http://localhost:4000/usehome/paypal-payment/success",
              cancel_url: "http://localhost:4000/userhome/paypal-payment/cancel",
            },
            transactions: [
              {
                item_list: {
                  items: [
                    {
                      name: "Red Sox Hat",
                      sku: "001",
                      price: "" + totalPrice,
                      currency: "USD",
                      quantity: 1,
                    },
                  ],
                },
                amount: {
                  currency: "USD",
                  total: "" + totalPrice,
                },
                description: "Hat for the best team ever",
              },
            ],
          };
        
          paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
              throw error;
            } else {
              console.log("Create Payment resoponse");
        
              payment.orderId = orderId;
                resolve(payment)

              
            //   {
            //     for (let i = 0; i < payment.links.length; i++) {
            //       if (payment.links[i].rel === "approval_url") {
            //         res.json({ forwardLink: payment.links[i].href });
            //       }
            //     }
            //   }
            }
          });
    })
    
  }
};

