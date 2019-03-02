var express = require('express');
var router = express.Router();
var controller = require('../controllers/POSController');
router.get('/createStock', controller.createStock);
module.exports = router;