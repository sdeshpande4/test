var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');


var orderSchema = new mongoose.Schema({
        //_id: Number,       
        companyName:String,
        customerAddress:String,
        item:String
});

orderSchema.plugin(autoIncrement.plugin, { model: 'Order', field: 'orderId',startAt: 1, incrementBy: 1 });
module.exports = mongoose.model('Order', orderSchema);
