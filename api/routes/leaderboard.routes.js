const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

const leaderboardController = require('../controllers/leaderboard.controller');

router.get('/leaderboard', leaderboardController.getLeaderboard);
router.get('/cache', auth, leaderboardController.getCachedLeaderboard);

module.exports = router;