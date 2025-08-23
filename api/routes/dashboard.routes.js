const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const dailySongController = require('../controllers/dailySong.controller')
const authMiddleware = require('../middlewares/auth.middleware');
const checkAdminRole = require('../middlewares/checkRole.middleware');
const authController = require('../controllers/auth.controller');

router.post('/categories', authMiddleware, checkAdminRole, categoryController.saveCategories);
router.put('/categories/:id', authMiddleware, checkAdminRole, categoryController.updateCategories);
router.delete('/categories/:id', authMiddleware, checkAdminRole, categoryController.deleteCategories);
router.post('/daily', authMiddleware, checkAdminRole, dailySongController.saveDeezerDailyController);
router.get('/daily', authMiddleware, checkAdminRole, dailySongController.getDeezerDailyController);
router.put('/daily/:id', authMiddleware, checkAdminRole, dailySongController.updateDeezerDailyController);
router.delete('/daily/:id', authMiddleware, checkAdminRole, dailySongController.deleteDeezerDailyController);

router.get('/users', authMiddleware, checkAdminRole, authController.getAllUser);
router.get('/countUsers', authMiddleware, checkAdminRole, authController.countUsers);
router.get('/searchUsers', authMiddleware, checkAdminRole, authController.searchUser);
router.put('/users/:id', authMiddleware, checkAdminRole, authController.updateUser);
router.delete('/users/:id', authMiddleware, checkAdminRole, authController.deleteUser);

module.exports = router;