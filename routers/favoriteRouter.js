const { Router } = require('express');
const FavoriteControllers = require('../controllers/FavoriteControllers.js');
const router = new Router();

router.get('/', FavoriteControllers.getOne);
router.put('/product/:productId([0-9]+)/append', FavoriteControllers.append);
router.put('/clear', FavoriteControllers.clear);

module.exports = router;
