const express = require('express');
const router = express.Router();
const generalParamController = require('../controllers/generalParam.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkAdminRole = require('../middlewares/checkRole.middleware');

router.get('/params', generalParamController.getGeneralParams); // Todos o filtrados por mode
router.post('/params', authMiddleware, checkAdminRole, generalParamController.createGeneralParam);
router.put('/params/:id', authMiddleware, checkAdminRole, generalParamController.updateGeneralParam);

module.exports = router;