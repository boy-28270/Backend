var mongoose = require('mongoose');
var HistorySchema = mongoose.Schema({
    refCode : {type : String,required: true},
    totalItem : {type : Number,required: true},
    totalPrice : {type : Number,required: true},
    discount : {type : Number,required: true},
    summary : {type : Number,required: true},
    receive : {type : Number,required: true},
    change : {type : Number,required: true},
    items : {type : Array,required: true},
    profit : {type : Number,required: true},
    created : {type : Date,required: true}
},{ collection : 'transaction'}
);
module.exports = mongoose.model('Transaction', HistorySchema);