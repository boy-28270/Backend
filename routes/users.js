var express = require('express');
var router = express.Router();
var controller = require('../controllers/UserController');
router.get('/students', controller.getUserByStudentId);//ตรงนี้จะเรียกผ่านcontroller แทน
module.exports = router;