const { Router } = require('express');
const router = new Router();
const CommentLike = require('../controllers/CommentLikeControllers');

router.put('/product/:productId([0-9]+)/append', CommentLike.append);
router.put('/clear', CommentLike.clear);

module.exports = router;
