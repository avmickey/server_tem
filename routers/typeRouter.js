const { Router } = require('express');
const router = new Router();
const Type = require('../controllers/TypeControllers');

router.post('/', Type.set);
router.get('/', Type.get);
router.delete('/:id', Type.delete);

module.exports = router;
