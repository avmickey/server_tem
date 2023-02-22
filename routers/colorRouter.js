const { Router } = require('express');
const router = new Router();
const Color = require('../controllers/ColorControllers');

router.post('/', Color.set);
router.get('/', Color.get);
router.delete('/:id', Color.delete);

module.exports = router;
