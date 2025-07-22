const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkAdminRole = require('../middlewares/checkRole.middleware');
const gameSessionController = require('../controllers/gameSession.controller');

router.post('/game-sessions', authMiddleware, gameSessionController.createSessionWithAttempts);
router.get('/game-sessions', authMiddleware, checkAdminRole, gameSessionController.getUserSessions);

module.exports = router;