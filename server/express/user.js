const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.post('/verify', userController.verify);
router.get('/:mailId', userController.findByEmail);
router.post('/decrypt', userController.decrypt);
router.get('/', userController.getAll);
router.get('/delete/:id', userController.deleteById);

module.exports = router;