var express = require('express');
var router = express.Router();
var controller = require('../controllers/POSController');
router.post('/createStock', controller.createStock);
module.exports = router;