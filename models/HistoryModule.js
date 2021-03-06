var mongoose = require('mongoose');
var HistorySchema = mongoose.Schema({
    code : {type : String,required: true},
    name : {type : String,required: true},
    color : {type : String,required: true},
    size : {type : String,required: true},
    image : {type : String,required: true},
    item : {type : Number,required: true},
    price : {type : Number,required: true},
    capitalPrice : {type : Number,required: true},
    created : {type : Date,required: true}
},{ collection : 'history'}
);
module.exports = mongoose.model('History', HistorySchema);