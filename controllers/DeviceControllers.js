const { Op } = require('sequelize');
const APIError = require('../errors/APIError');
const {
  Device,
  Brand,
  Type,
  Rating,
  DeviceImg,
  User,
} = require('../models/mapping');
const fs = require('fs');
const path = require('path');

class DeviceControllers {
  async getAllBrandOrType(req, res, next) {
    try {
      let { brandId, typeId, colorId, sales, low, tall } = req.body;
      const brand = JSON.parse(brandId || '[]');
      const arr = brand.length != 0;
      const color = JSON.parse(colorId || '[]');
      const arrColor = color.length != 0;
      let device;

      if (arr && !typeId && !arrColor) {
        device = await Device.findAndCountAll({
          where: {
            brandId: [...brand],
            sale: { [Op.not]: sales ? 0 : -1 },
            price: { [Op.lte]: +tall, [Op.gte]: +low },
          },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            { model: Rating, as: 'ratings' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (arr && !typeId && arrColor) {
        device = await Device.findAndCountAll({
          where: {
            brandId: [...brand],
            colorId: [...color],
            sale: { [Op.not]: sales ? 0 : -1 },
            price: { [Op.lte]: +tall, [Op.gte]: +low },
          },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            { model: Rating, as: 'ratings' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (!arr && typeId && !arrColor) {
        device = await Device.findAndCountAll({
          where: {
            typeId,
            sale: { [Op.not]: sales ? 0 : -1 },
            price: { [Op.lte]: +tall, [Op.gte]: +low },
          },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            { model: Rating, as: 'ratings' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (!arr && typeId && arrColor) {
        device = await Device.findAndCountAll({
          where: {
            typeId,
            colorId: [...color],
            sale: { [Op.not]: sales ? 0 : -1 },
            price: { [Op.lte]: +tall, [Op.gte]: +low },
          },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            { model: Rating, as: 'ratings' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (arr && typeId && !arrColor) {
        device = await Device.findAndCountAll({
          where: {
            typeId,
            brandId: [...brand],
            sale: { [Op.not]: sales ? 0 : -1 },
            price: { [Op.lte]: +tall, [Op.gte]: +low },
          },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            { model: Rating, as: 'ratings' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      if (arr && typeId && arrColor) {
        device = await Device.findAndCountAll({
          where: {
            typeId,
            brandId: [...brand],
            colorId: [...color],
            sale: { [Op.not]: sales ? 0 : -1 },
            price: { [Op.lte]: +tall, [Op.gte]: +low },
          },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
            { model: Rating, as: 'ratings' },
            {
              model: DeviceImg,
              as: 'deviceimg',
            },
          ],
        });
      }
      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async getGoodsList(req, res, next) {
    try {
      const { typeId, page, limit = 10 } = req.body;
      const offset = limit * page - limit;
      let device;
      if (typeId) {
        device = await Device.findAndCountAll({
          where: { typeId, sale: { [Op.not]: sales ? 0 : -1 } },
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
          ],
          offset,
          limit,
        });
      } else {
        device = await Device.findAndCountAll({
          include: [
            { model: Brand, as: 'brand' },
            { model: Type, as: 'type' },
          ],
          offset,
          limit,
        });
      }

      return res.json({ device, message: 'OK' });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const { sales, tall = 10000, low = 0 } = req.query;

      const device = await Device.findAndCountAll({
        where: {
          sale: { [Op.not]: sales ? 0 : -1 },
          price: { [Op.lte]: +tall, [Op.gte]: +low },
        },
        include: [
          { model: Brand, as: 'brand' },
          { model: Type, as: 'type' },
          { model: Rating, as: 'ratings' },
          {
            model: DeviceImg,
            as: 'deviceimg',
          },
        ],
      });

      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async set(req, res, next) {
    try {
      let {
        name,
        price,
        brandId,
        typeId,
        colorId,
        info,
        deviceimgId,
        sale,
        change,
      } = req.body;
      const device = await Device.create({
        name,
        price: parseFloat(price),
        brandId,
        colorId,
        typeId,
        deviceimgId,
        sale,
        info,
        change,
      });
      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async get(req, res, next) {
    try {
      const { id } = req.params;

      const device = await Device.findOne({
        where: { id },
        include: [
          { model: Brand, as: 'brand' },
          { model: Type, as: 'type' },
          { model: Rating, as: 'ratings' },
          {
            model: DeviceImg,
            as: 'deviceimg',
          },
        ],
      });

      return res.json(device);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async change(req, res, next) {
    try {
      const {
        id,
        name,
        price,
        brandId,
        typeId,
        colorId,
        info = '',
        sale,
        change = false,
      } = req.body;
      let device = await Device.findOne({
        where: {
          id,
        },
      });
      const user = await User.findOne({
        where: { id: req.signedCookies.userId },
      });

      if (device.change || change || user.role == 'Admin') {
        device = await Device.update(
          {
            name,
            price,
            brandId,
            colorId,
            typeId,
            sale,
            info,
          },
          {
            where: { id },
          }
        );
        return res.json({ device, message: 'ok' });
      } else {
        return next(APIError.badRequest('product will not be cahnge'));
      }
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id, change = false } = req.params;

      let user;
      if (req.signedCookies.userId) {
        user = await User.findOne({
          where: { id: req.signedCookies.userId },
        });
      }
      if (!id) {
        throw new Error('???? ???????????? id ????????????????????????');
      }
      const device = await Device.findOne({
        where: {
          id,
        },
      });

      if (device.change || change || user?.role == 'Admin') {
        if (!device) {
          throw new Error('?????????? ???? ???????????? ?? ????');
        }

        const image = await DeviceImg.findOne({
          where: { id: device.deviceimgId },
        });

        image.destroy();
        for (const [key, value] of Object.entries(JSON.parse(image.img))) {
          if (value) {
            fs.unlinkSync(path.resolve(__dirname, '..', 'static', value));
          }
        }
        await device.destroy({ truncate: true, cascade: false });

        return res.json(device);
      } else {
        return next(APIError.badRequest('product will not be delete'));
      }
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new DeviceControllers();
