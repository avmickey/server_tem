const APIError = require('../errors/APIError');
const { Device, User, Rating } = require('../models/mapping');

class CommetControllers {
  async get(req, res, next) {
    try {
      const { deviceId } = req.params;
      if (deviceId) {
        return next(APIError.badRequest('not found deviceId'));
      }
      const rating = await Rating.findAll({
        where: { deviceId },
        include: [{ model: User, as: 'users' }],
      });
      return res.json(rating);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async change(req, res, next) {
    try {
      const { userId, deviceId, quantity } = req.query;
      let rating = await Rating.findOne({ where: { deviceId, userId } });

      if (rating) {
        await Rating.update(
          {
            quantity: quantity,
          },
          { where: { deviceId, userId } }
        );
      } else {
        await Rating.create({ deviceId, userId, quantity });
      }

      rating = await Rating.findAll({ where: { deviceId } });

      return res.json({ message: 'ok', rating });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { userId, deviceId } = req.query;
      await Rating.destroy({ where: { userId, deviceId } });
      const device = await Device.findOne({
        where: { id: deviceId },
        include: [{ model: Rating, as: 'ratings' }],
      });

      return res.json({ message: 'ok', device });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new CommetControllers();
