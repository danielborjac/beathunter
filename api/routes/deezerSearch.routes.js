const express = require('express');
const deezerSearchController = require('../controllers/deezerSearch.controller');


const router = express.Router();

//router.get('/random', authMiddleware, deezerController.deezerRandomController);
router.get('/genres', deezerSearchController.getDeezerGenres);
router.get('/artists', deezerSearchController.getDeezerArtists);
router.get('/playlists', deezerSearchController.getDeezerPlaylists);
router.get('/songs', deezerSearchController.getDeezerTracks);



module.exports = router;