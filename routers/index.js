const { Router } = require('express');
const router = new Router();
const User = require('./userRouter');
const Device = require('./deviceRouter');
const Brand = require('./brandRouter');
const Type = require('./typeRouter');
const UserCheck = require('./userCheck');
const Basket = require('./basketRouter');
const Favorite = require('./favoriteRouter');
const UserFile = require('./userFileRouter');
const Color = require('./colorRouter');
const Image = require('./imgRouter');
const Comment = require('./commentRouter');
const LikeComment = require('./likeComment.js');
const Rating = require('./ratingRouter.js');

router.use('/user', User);
router.use('/device', Device);
router.use('/brand', Brand);
router.use('/category', Type);
router.use('/usercheck', UserCheck);
router.use('/basket', Basket);
router.use('/favorite', Favorite);
router.use('/userfile', UserFile);
router.use('/color', Color);
router.use('/img', Image);
router.use('/comment', Comment);
router.use('/likecomment', LikeComment);
router.use('/rating', Rating);

module.exports = router;
