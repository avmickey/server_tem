const APIError = require('../errors/APIError');
const {
  Comment,
  Likes,
  User,
  LikeComment,
  Rating,
  DisLikeComment,
} = require('../models/mapping');

class CommetControllers {
  async set(req, res, next) {
    try {
      const { text, deviceId } = req.body;
      const date = `${new Date().toLocaleDateString(
        'en-US'
      )} ${new Date().toLocaleTimeString('en-US')}`;

      if (!text && !deviceId) {
        return next(APIError.badRequest('не задано поле text'));
      }

      const user = await User.findOne({
        where: { id: req.signedCookies.userId },
      });
      let comment = await Comment.findOne({
        where: { deviceId, userId: user.id },
      });
      if (user && !comment) {
        comment = await Comment.create({
          text,
          deviceId,
          date,
          userId: req.signedCookies.userId,
        });
        const like = await Likes.create({
          commentId: comment.id,
        });
      } else {
        return next(
          APIError.badRequest('not found cookies, or comment is already bean')
        );
      }

      return res.json({ message: 'ok', comment });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const { deviceId } = req.params;
      const comment = await Comment.findAll({
        where: { deviceId },
        include: [
          {
            model: Likes,
            as: 'like',
            include: [
              {
                model: LikeComment,
                as: 'likecomments',
              },
              {
                model: DisLikeComment,
                as: 'dislikes',
              },
            ],
          },
          { model: User, as: 'user' },
        ],
      });
      return res.json(comment);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async change(req, res, next) {
    try {
      const { id, text } = req.body;
      const date = `${new Date().toLocaleDateString(
        'en-US'
      )} ${new Date().toLocaleTimeString('en-US')}`;
      await Comment.update(
        {
          text: text,
          date,
        },
        {
          where: { id },
        }
      );
      const comment = await Comment.findOne({
        where: { id },
        include: [
          { model: Likes, as: 'like' },
          { model: User, as: 'user' },
        ],
      });
      return res.json(comment);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { commentId, userId } = req.params;
      let comment;
      const user = await User.findOne({
        where: { id: req.signedCookies.userId },
      });
      if (req.signedCookies.userId == userId || user.role == 'Admin') {
        comment = await Comment.destroy({
          where: { id: commentId },
          truncate: true,
          cascade: false,
        });
      } else {
        return next(APIError.badRequest('not found cookies'));
      }

      const like = await Likes.destroy({
        where: { commentId },
        include: [
          {
            model: LikeComment,
          },
          {
            model: DisLikeComment,
          },
        ],
      });
      return res.json(comment);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new CommetControllers();
