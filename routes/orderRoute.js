const express = require('express');
const checkController = require('../controllers/checkController');
const orderController = require('../controllers/orderController');
const statusController = require('../controllers/statusController');

const router = express.Router();

router.get('/admin/:param', checkController.protect, checkController.checkAdminRole, orderController.getListOrderByAll, statusController.getStatusListAll);

router.get('/user/:param', checkController.protect, checkController.checkCustomerRole, orderController.getListOrderByUser, statusController.getStatusListByUser);

router.get('/search/:trackingNumber', orderController.searchOrder, statusController.getStatus);

router.post('/', checkController.protect, orderController.createOrder, statusController.createStatus);

router.delete('/:id', checkController.protect, checkController.checkAdminRole, statusController.deleteStatus, orderController.deleteOrder);


module.exports = router;