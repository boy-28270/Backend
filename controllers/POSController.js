var express = require('express');
var config = require('../config/db');
var mongoose = require('mongoose');
var Stock = require('../models/StockModule');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(config.dbPos, options)
.then(result => { 
    console.log("Mongo Connect"); 
})
.catch(err => {
    console.log(err); 
});

const createStock = (req, res) => {
    const createStock = { 
        code : req.body.code,
        name : req.body.name,
        color : req.body.color,
        size : req.body.size,
        image : req.body.image,
        item : Number(req.body.price),
        price : Number(req.body.price),
        capitalPrice : Number(req.body.capitalPrice),
     };
    Stock.create(createStock, function(err, stock){
        if(err){
            res.json({status: 400});
             console.log(err);
        }else{
            res.json({status: 200});
       }
    });
};

module.exports = {
    createStock
};