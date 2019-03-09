var mongoose = require('mongoose');
var dateNow
var StockSchema = mongoose.Schema({
    code : {type : String,required: true},
    name : {type : String,required: false},
    color : {type : String,required: false},
    size : {type : String,required: false},
    image : {type : String,required: false},
    item : {type : Number,required: true},
    price : {type : Number,required: true},
    capitalPrice : {type : Number,required: true},
    created : {type : Date,required: false},
    updated : {type : Date,required: true}
},{ collection : 'stock'}
);
module.exports = mongoose.model('Stock', StockSchema);