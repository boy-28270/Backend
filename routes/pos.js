var express = require('express');
var router = express.Router();
var controller = require('../controllers/POSController');
router.post('/createStock', controller.createStock);
router.post('/updateStock', controller.updateStock);
router.post('/inquiryStock', controller.inquiryStock);
router.post('/inquiryListStock', controller.inquiryListStock);
module.exports = router;