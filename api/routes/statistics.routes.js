const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const statsController = require('../controllers/statistics.controller');

router.get('/statistics', auth, statsController.getUserStatistics);

module.exports = router;
