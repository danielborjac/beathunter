const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/songs', authMiddleware, songController.getAllSongs);
router.get('/songs/:id/fragments', authMiddleware, songController.getFragmentsBySongId);

module.exports = router;