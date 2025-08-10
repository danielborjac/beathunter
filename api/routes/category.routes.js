const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const dailySongController = require('../controllers/dailySong.controller')
const authMiddleware = require('../middlewares/auth.middleware');
const checkAdminRole = require('../middlewares/checkRole.middleware');

router.get('/categories', categoryController.getCategories);

module.exports = router;