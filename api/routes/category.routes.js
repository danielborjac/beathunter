const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/categories', categoryController.getCategories);
router.get('/countCategoriesByMode', categoryController.countCategoriesByMode);

module.exports = router;