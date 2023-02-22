const { Router } = require('express');
const router = new Router();
const Comment = require('../controllers/LikeCommentControllers');

router.get('/:commentId', Comment.get);
router.post('/', Comment.change);

module.exports = router;
