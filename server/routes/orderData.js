var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var Order = require('./model/order');

router.get('/', function(req, res) {
  res.json({
    results: "test"
  });
});

// Create Order
router.post('/create', function(req, res) {
    var companyname= req.body.company; //"SuperTrader";
    var address=req.body.address; //"Steindamm 80";
    var item=req.body.item;//"Macbook002";
    var data = {"companyName":companyname,"customerAddress":address,"item":item};
    var neworder = new Order(data);
    neworder.save(function(err) {
        if (err) {
           return res.send({error_code:1,error:err});
        }
        
        var msg = 'Order saved successfully!';
        console.log(msg);        
        return res.send({error_code:0,msg:msg});
    });
 
});

// get all the orders
router.get('/fetchorders', function(req, res) {
    console.log('fetch all orders');
    Order.find({}, function(err, orders) {
        if (err) {
           return res.send({error_code:1,error:err});
        }
        //console.log('Orders : ' ,orders);
        return res.send({error_code:0,data:orders});
    });
 
});

//Find the order
router.post('/search', function(req, res) {
     console.log('Inside search request');
    var orderId=req.body.orderId; 
    Order.find({orderId:orderId}, function(err, order) {
        if (err) {
           return res.send({error_code:1,error:err});
        }
        console.log('order : ', order);
        return res.send({error_code:0,data:order});
    });  
 
});

//Find the order
router.post('/searchbyaddress', function(req, res) {
    var address=req.body.address; 
    Order.find({customerAddress:address}, function(err, order) {
        if (err) {
           return res.send({error_code:1,error:err});
        }
        if(order != null && order.length < 1){
            var msg = 'No order found';
            return res.send({error_code:0,data:msg});
        }
        console.log('order : ', order);
        return res.send({error_code:0,data:order});
    });
    
 
});

//Update the order
router.post('/update', function(req, res) {
    var orderId=req.body.orderid; 
    var newcompanyName=req.body.company;
    var newaddress=req.body.address;
    
    Order.findOneAndUpdate({orderId:orderId} , { companyName: newcompanyName, customerAddress:newaddress },
            function(err, order) {
            if (err) {
                return res.send({error_code:1,error:err,update:false});
            }

            if(order == null){
                var msg = 'invalid order id';
                return res.send({error_code:0,update:false});
            }


            console.log('Order successfully updated! : ',order);
            return res.send({error_code:0,update:true});        
            
        });   
 
});


//Delete the order
router.post('/remove', function(req, res) {
    var orderId=req.body.orderid; 
    Order.findOneAndRemove({orderId:orderId} , function(err,order) {
            if (err) {
                return res.send({error_code:1,error:err,delete:false});
            }

            if(order == null){
                var msg = 'invalid order id';
                return res.send({error_code:0,delete:false});
            }

            var msg = 'Order deleted';
            console.log(msg);
            return res.send({error_code:0,data:msg,delete:true});        
            
        });     
 
});


module.exports = router;