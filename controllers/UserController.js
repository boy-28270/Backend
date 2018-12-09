var express = require('express');
var config = require('../config/db');
var mongoose = require('mongoose');
var User = require('../models/UserModule');

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
mongoose.connect(config.db, options)
.then(result => { 
    console.log("Mongo Connect"); 
})
.catch(err => {
    console.log(err); 
});

const getUserByStudentId = (req, res) => {
    console.log("#######" + req.query.student_id);
    const queryuser = { student_id : req.query.student_id };
    User.findOne(queryuser, function(err, user){
        if(err){
            //  console.log(err);
        }else{
             res.json(user);
       }
    });
};

module.exports = {
    getUserByStudentId
};