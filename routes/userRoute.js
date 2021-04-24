const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const checkController = require('../controllers/checkController');


const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
});
const upload = multer({
    storage: storage, fileFilter: (req, file, cb) => {
        if (file.mimetype.split('/')[1] === 'jpeg' || file.mimetype.split('/')[1] === 'jpg' || file.mimetype.split('/')[1] === 'png') {
            cb(null, true);
        } else {
            cb(new Error('this file is not a photo'));
        }
    }
});

router.get('/', checkController.protect, userController.getProFileUser);

router.post('/register', upload.single('image'), userController.register);

router.post('/login', userController.login);

router.put('/', checkController.protect, checkController.checkCustomerRole, userController.changePassword);

router.patch('/', checkController.protect, checkController.checkCustomerRole, upload.single('image'), userController.editProFileUser);



module.exports = router;