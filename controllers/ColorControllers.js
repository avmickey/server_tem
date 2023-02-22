const APIError = require('../errors/APIError');
const { Color, Device } = require('../models/mapping');

class ColorControllers {
  async set(req, res, next) {
    try {
      const { name, color } = req.body;

      if (!name || !color) {
        return next(APIError.badRequest('не задано поле name or color'));
      }
      let colorBlock = await Color.findOne({ where: { name } });
      if (colorBlock) {
        return next(APIError.badRequest('already been'));
      }
      await Color.create({ name, color });
      colorBlock = await Color.findAll();
      return res.json({ body: colorBlock, message: 'ok' });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const color = await Color.findAll();
      return res.json(color);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const device = await Device.findAll({
        where: { colorId: id },
      });
      if (device.length > 0) {
        return next(APIError.badRequest('element cannot be removed'));
      }
      await Color.destroy({ where: { id } });
      const color = await Color.findAll();
      return res.json({ body: color, message: 'ok' });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new ColorControllers();
