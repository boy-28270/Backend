var express = require('express');
var config = require('../config/db');
var mongoose = require('mongoose');
var Stock = require('../models/StockModule');
var History = require('../models/HistoryModule');
var moment = require('moment');

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
    console.log("Request Body : ",req.body)
    const date = moment()
    const createStock = { 
        code : req.body.code,
        name : req.body.name,
        color : req.body.color,
        size : req.body.size,
        image : req.body.image,
        item : Number(req.body.price),
        price : Number(req.body.price),
        capitalPrice : Number(req.body.capitalPrice),
        created : date,
        updated : date
     };
     const queryStock = { code : req.body.code };
     Stock.findOne(queryStock, function(err, stock){
        if (err) {
            res.status(200).send({ 
                status: 0,
                errorMsg: "เกิดข้อผิดพลาดในระบบ" 
            });          } else {
            if (stock) {
                res.status(200).send({ 
                    status: 0,
                    errorMsg: "มีอยู่แล้วในระบบ" 
                });
            } else {
                Stock.create(createStock, function(err, stock){
                    if (err) {
                        res.status(500).send({ error: err });
                    } else {
                        res.status(200).send({
                            status: 1,
                            id: stock._id
                        });
                   }
                });            
            }
       }
    });
};

const updateStock = (req, res) => {
    console.log("Request Body : ",req.body)
    const queryStock = { code : req.body.code };
     Stock.findOne(queryStock, function(err, stock){
        if (err) {
            console.log(err);
        } else {
            if (stock) {
                const updateStock = { 
                    code : req.body.code,
                    item : Number(stock.item) + Number(req.body.item),
                    price : Number(req.body.price),
                    capitalPrice : Number(stock.capitalPrice) + Number(req.body.capitalPrice),
                    updated : moment()
                };
                Stock.findOneAndUpdate({code:updateStock.code}, updateStock, function (err, place) {
                    if (err) {
                        res.status(200).send({ 
                            status: 0,
                            errorMsg: "ไม่พบข้อมูลในระบบ" 
                        });   
                    } else {
                        const createHistory = { 
                            code : req.body.code,
                            name : place.name,
                            color : place.color,
                            size : place.size,
                            image : place.image,
                            item : req.body.item,
                            price : req.body.price,
                            capitalPrice :req.body.capitalPrice,
                            created : moment()
                         };
                        History.create(createHistory, function(err, stock){
                            if (err) {
                                res.status(200).send({ 
                                    status: 0,
                                    errorMsg: "เกิดข้อผิดพลาดในระบบ" 
                                });  
                            } else {
                                res.status(200).send({
                                    status: 1,
                                    msg: "อัพเดทข้อมูลเรียบร้อย",
                                    data: updateStock
                                });
                           }
                        });      
                   }
                }); 
            } else {
                res.status(200).send({ 
                    status: 0,
                    errorMsg: "ไม่พบข้อมูลในระบบ" 
                });           
            }
       }
    });
};

const inquiryStock = (req, res) => {
    console.log("Request Body : ",req.body)
    const queryStock = { code : req.body.code };
     Stock.findOne(queryStock, function(err, stock){
        if (stock) {
            var data = {
                code : stock.code,
                name : stock.name,
                color : stock.color,
                size : stock.size,
                image : stock.image,
                item : stock.price,
                price : stock.price,
                capitalPrice : stock.capitalPrice
            }
            res.status(200).send({ 
                status: 1,
                data: data
            }); 
        } else {
            res.status(200).send({ 
                status: 0,
                errorMsg: "ไม่พบข้อมูลในระบบ" 
            });      
       }
    });
};

const inquiryListStock = (req, res) => {
     Stock.find({}, function(err, stock){
        if (stock) {
            var hashMap = new Map();
            stock.forEach(element => {
                var keyFull = element.name+"_"+element.color;
                if(hashMap.has(keyFull)) {
                    var obj = hashMap.get(keyFull);
                    var key = element.size;
                    obj[key] = element.item;
                    hashMap.set(keyFull, obj)
                } else {
                    var key = element.size;
                    var obj = {};
                    obj["image"] = element.image
                    obj[key] = element.item;
                    hashMap.set(keyFull, obj)
                }
            });

            var array = [];
            hashMap.forEach(function(value, key) {
                array.push(value);
            });

            res.status(200).send({ 
                status: 1,
                data: array
            }); 
        } else {
            res.status(200).send({ 
                status: 0,
                errorMsg: "ไม่พบข้อมูลในระบบ" 
            });      
       }
    });
};

module.exports = {
    createStock,
    updateStock,
    inquiryStock,
    inquiryListStock
};