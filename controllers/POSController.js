var express = require('express');
var config = require('../config/db');
var mongoose = require('mongoose');
var Stock = require('../models/StockModule');
var History = require('../models/HistoryModule');
var Transaction = require('../models/TransactionModule');
var moment = require('moment');
var uuid = require('uuid/v4');
var multer = require('multer');

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
        name : req.body.name.toUpperCase().split(' ').join(''),
        color : req.body.color,
        size : req.body.size,
        image : "/pos/images/"+req.body.code+".JPG",
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
            res.status(200).send({ 
                status: 0,
                errorMsg: "เกิดข้อผิดพลาดในระบบ" 
            });  
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
                            created : moment().locale('th')
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
                item : stock.item,
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
    console.log("Request Body : ",req.body)
     Stock.find({}, function(err, stock){
        if (stock) {
            var hashMap = new Map();
            var totalSizeS = 0;
            var totalSizeM = 0;
            var totalSizeL = 0;
            var totalSizeXL = 0;
            stock.forEach(element => {
                var keyFull = element.name+"_"+element.color;
                if(hashMap.has(keyFull)) {
                    var obj = hashMap.get(keyFull);
                    var key = element.size;
                    if(key === "S") {
                        totalSizeS += Number(element.item);
                    } else if(key === "M") {
                        totalSizeM += Number(element.item);
                    } else  if(key === "L") {
                        totalSizeL += Number(element.item);
                    } else if(key === "XL") {
                        totalSizeXL += Number(element.item);
                    }
                    obj[key] = element.item;
                    hashMap.set(keyFull, obj)
                } else {
                    var key = element.size;
                    if(key === "S") {
                        totalSizeS += Number(element.item);
                    } else if(key === "M") {
                        totalSizeM += Number(element.item);
                    } else  if(key === "L") {
                        totalSizeL += Number(element.item);
                    } else if(key === "XL") {
                        totalSizeXL += Number(element.item);
                    }   
                    var obj = {};
                    obj["name"] = element.name
                    obj["color"] = element.color
                    obj["image"] = element.image
                    obj["S"] = 0
                    obj["M"] = 0
                    obj["L"] = 0
                    obj["XL"] = 0
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
                totalItem: totalSizeS + totalSizeM + totalSizeL + totalSizeXL,
                totalSizeS: totalSizeS,
                totalSizeM: totalSizeM,
                totalSizeL: totalSizeL,
                totalSizeXL: totalSizeXL,
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

const buyItem = (req, res) => {
    console.log("Request Body : ",req.body)
    var items = req.body.items;
    var profit = 0;
    var capitalPriceTotal = 0;
    var promises = new Promise(function(resolve, reject) {
        items.forEach(item => {
            const queryStock = { code : item.code };
            Stock.findOne(queryStock, function(err, stock){
                if (err) {
                    reject({ 
                        status: 0,
                        errorMsg: "เกิดข้อผิดพลาดในระบบ" 
                    })
                } else {
                    if(stock) {
                        const updateStock = { 
                            code : stock.code,
                            item : Number(stock.item) - Number(item.item),
                            price : Number(stock.price),
                            capitalPrice : Number(stock.capitalPrice) - ( ( Number(stock.capitalPrice) / Number(stock.item) ) * Number(item.item) ),
                            updated : moment()
                        };
                        capitalPriceTotal += (Number(stock.price) - (Number(stock.capitalPrice) / Number(stock.item)));
                        if (updateStock.item < 0 || updateStock.capitalPrice < 0) {
                            reject({ 
                                status: 0,
                                errorMsg: "สิ้นค้าหมด" 
                            }) 
                        } else {
                            Stock.findOneAndUpdate({code:stock.code}, updateStock, function (err, place) {
                                if (err) {
                                    reject({ 
                                        status: 0,
                                        errorMsg: "เกิดข้อผิดพลาดในระบบ" 
                                    })
                                } else {
                                    resolve({ 
                                        status: 1,
                                        msg: "อัพเดทข้อมูลเรียบร้อย"
                                    });
                                }
                            }); 
                        }
                    } else {
                        reject({ 
                            status: 0,
                            errorMsg: "ไม่พบข้อมูลในระบบ" 
                        })
                    }
                }
            });
        });
    });
    
    promises.then((value) => {
        profit = capitalPriceTotal - Number(req.body.discount)
        var createTransaction = {
            refCode : uuid(),
            totalItem : Number(req.body.totalItem),
            totalPrice : Number(req.body.totalPrice),
            discount : Number(req.body.discount),
            summary : Number(req.body.summary),
            receive : Number(req.body.receive),
            change : Number(req.body.change),
            items : req.body.items,
            profit : profit,
            created : moment().locale('th')
        }
        Transaction.create(createTransaction);  
        res.status(200).send(value);
    }).catch((value) => {
        res.status(200).send(value);
    })
    console.log("Response Body : ",res);
}

const inquiryTransaction = (req, res) => {
    console.log("Request Body : ",req.body)
    var date = new Date();
    // var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getDate() - 1;
    var time = new Date("July 21, 1983 12:00:00");
    date.setDate(date.getDate() - 1);
    date.setTime(time.getTime);
    var q = Transaction.find({created:{$gte: date}}).sort({'created': -1});
    q.exec(function(err, transaction) {
        if (transaction) {
            res.status(200).send({ 
                status: 1,
                data: transaction
            }); 
        } else {
            res.status(200).send({ 
                status: 0,
                errorMsg: "ไม่พบข้อมูลในระบบ" 
            });      
        }
        console.log("Response Body : ",res);
    });
};

const uploadImage = (req, res) => {
    var code = req.query.code;
    var Storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, "/var/www/html/pos/images");
        },
        filename: function(req, file, callback) {
            callback(null, code);
        }
    });
    var upload = multer({
        storage: Storage
    }).array("imgUploader", 3); //Field name and max count
    upload(req, res, function(err) {
        if (err) {
            res.status(200).send({ 
                status: 0,
                errorMsg: "อัพโหลดรูปภาพไม่สำเร็จ" 
            });    
        } else {
            res.status(200).send({ 
                status: 1,
                msg: "อัพโหลดรูปภาพสำเร็จ" 
            });
        }
    });
}

module.exports = {
    createStock,
    updateStock,
    inquiryStock,
    inquiryListStock,
    inquiryTransaction,
    buyItem,
    uploadImage
};