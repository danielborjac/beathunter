const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const gameSessionController = require('../controllers/gameSession.controller');

router.post('/game-sessions', authMiddleware, gameSessionController.createSessionWithAttempts);
router.get('/game-sessions', authMiddleware, gameSessionController.getUserSessions);

module.exports = router;