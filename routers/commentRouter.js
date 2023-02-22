const { Router } = require('express');
const router = new Router();
const Comment = require('../controllers/CommetControllers');

router.post('/', Comment.set);
router.patch('/', Comment.change);
router.get('/:deviceId', Comment.get);
router.delete('/:commentId/:userId', Comment.delete);

module.exports = router;
