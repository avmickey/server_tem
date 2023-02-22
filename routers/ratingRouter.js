const { Router } = require('express');
const router = new Router();
const Rating = require('../controllers/RatingControllers');

router.get('/:deviceId', Rating.get);
router.get('/', Rating.change);
router.delete('/', Rating.delete);

module.exports = router;
