const Router = require('express');
const router = new Router();
const UserCheckControllers = require('../controllers/UserCheckControllers.js');

router.post('/registration', UserCheckControllers.registration);
router.post('/login', UserCheckControllers.loginCheck);
router.get('/validcode', UserCheckControllers.validcode);

module.exports = router;
