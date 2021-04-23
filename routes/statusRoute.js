const express = require('express');
const statusController = require('../controllers/statusController');
const checkController = require('../controllers/checkController');


const router = express.Router();

router.patch('/:id', checkController.protect, checkController.checkAdminRoCustomerRole, statusController.updateStatus);

module.exports = router;