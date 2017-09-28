'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var path  = require('path');

var test = require('./routes/test.js'); 
var orderData = require('./routes/orderData.js'); 

var   expressValidator = require('express-validator');
var app = express();

var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json({
  limit: '100k',
}));
app.use(expressValidator());

const PORT = 5000;
const HOST = 'localhost';

app.use('/test',function(req, res, next){
	console.log("A new main request received at " + Date.now());
     res.header("Access-Control-Allow-Origin", "*");
     res.header( "Access-Control-Allow-Headers , *") ;	
	next();
});

app.use('/orders',function(req, res, next){
	console.log("A new orderData request received at " + Date.now());
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
     res.header('Access-Control-Allow-Credentials', true);
	next();
});

const html = __dirname + '/dist';
app.use(express.static(html));

app.use('/test', test);
app.use('/orders', orderData);

app.get('/*',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

   res.sendFile(path.join(__dirname,'/dist/index.html'));
});
  
app.get('/',function(req,res){
   res.sendFile(path.join(__dirname,'/dist/index.html'));
});

var dbURI = 'mongodb://localhost:27017/demo'; 

var server = app.listen(PORT, HOST,function(){
     var port = server.address().port;
     mongoose.connect(dbURI); 
     console.log('Demo tool server listening at ', port); 
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
  
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

module.exports = app;
