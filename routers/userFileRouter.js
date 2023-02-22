const Router = require('express');
const router = new Router();
const User = require('../controllers/UserFilesControllers.js');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', User.registration);
router.post('/login', User.login);
router.get('/check', authMiddleware, User.check);

module.exports = router;
