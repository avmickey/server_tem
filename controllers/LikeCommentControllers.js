const APIError = require('../errors/APIError');
const { Likes, LikeComment, DisLikeComment } = require('../models/mapping');

class LikeCommentControllers {
  async get(req, res, next) {
    try {
      const { commentId } = req.params;

      if (!commentId) {
        return next(APIError.badRequest('не задано поле commentId'));
      }

      const comment = await Likes.findAll({
        where: { commentId },
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
      });
      return res.json(comment);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async change(req, res, next) {
    try {
      const { userId, commentId, add } = req.body;

      console.log(userId);
      console.log(2);

      if (!userId && !commentId) {
        return next(APIError.badRequest('не задано поле userId или commentId'));
      }
      let like = await Likes.findOne({ where: { commentId } });

      if (!like) {
        return next(APIError.badRequest('comment не найден'));
      }

      const element = await LikeComment.findOne({
        where: { userId, likeId: like.id },
      });

      const dis = await DisLikeComment.findOne({
        where: { userId, likeId: like.id },
      });

      if (add) {
        if (element) {
          await LikeComment.destroy({ where: { userId, likeId: like.id } });
          await like.decrement('quantityLike', { by: 1 });
        } else {
          await LikeComment.create({
            userId,
            likeId: like.id,
          });
          await like.increment('quantityLike', { by: 1 });
        }
        if (dis) {
          await DisLikeComment.destroy({ where: { userId, likeId: like.id } });
          await like.decrement('quantityDis', { by: 1 });
        }
      } else {
        if (dis) {
          await DisLikeComment.destroy({ where: { userId, likeId: like.id } });
          await like.decrement('quantityDis', { by: 1 });
        } else {
          await DisLikeComment.create({ userId, likeId: like.id });
          await like.increment('quantityDis', { by: 1 });
        }
        if (element) {
          await LikeComment.destroy({ where: { userId, likeId: like.id } });
          await like.decrement('quantityLike', { by: 1 });
        }
      }

      like = await Likes.findOne({
        where: { commentId },
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
      });

      return res.json(like);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new LikeCommentControllers();
