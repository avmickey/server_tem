const APIError = require('../errors/APIError');
const { Brand, Device } = require('../models/mapping');

class BrandConstrollers {
  async set(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return next(APIError.badRequest('не задано поле name'));
      }
      let brand = await Brand.findOne({ where: { name } });
      if (brand) {
        return next(APIError.badRequest('already been'));
      }
      await Brand.create({ name });
      brand = await Brand.findAll();
      return res.json({ body: brand, message: 'ok' });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const brand = await Brand.findAll();
      return res.json(brand);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const device = await Device.findAll({
        where: { brandId: id },
      });
      if (device.length > 0) {
        return next(APIError.badRequest('element cannot be removed'));
      }
      await Brand.destroy({ where: { id } });
      const brand = await Brand.findAll();
      return res.json({ body: brand, message: 'ok' });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new BrandConstrollers();
