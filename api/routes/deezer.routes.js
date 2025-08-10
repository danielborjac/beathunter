const express = require('express');
const deezerController = require('../controllers/deezer.controller');


const router = express.Router();

//router.get('/random', authMiddleware, deezerController.deezerRandomController);
router.post('/category', deezerController.deezerCategoryController);
router.get('/daily', deezerController.deezerDailyController);

module.exports = router;