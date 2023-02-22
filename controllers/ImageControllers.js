const APIError = require('../errors/APIError');
const { DeviceImg, Device } = require('../models/mapping');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

class ImageControllers {
  async set(req, res, next) {
    try {
      const files = req.files;
      const obj = {};
      if (!(files.length != 0)) {
        return next(APIError.badRequest('не задано поле img'));
      }

      for (const [key, value] of Object.entries(files)) {
        const filename = uuid.v4() + '.png';
        value.mv(path.resolve(__dirname, '..', 'static', filename));
        obj[value.name] = filename;
      }

      const image = await DeviceImg.create({ img: JSON.stringify(obj) });
      return res.json({ body: image, message: 'ok' });
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async get(req, res, next) {
    try {
      const image = await DeviceImg.findAll();
      return res.json(image);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async change(req, res, next) {
    try {
      const { id, img } = req.body;
      const obj = {};

      const files = req.files;
      const device = await Device.findOne({
        where: {
          id,
        },
        include: [
          {
            model: DeviceImg,
            as: 'deviceimg',
          },
        ],
      });

      const image = await DeviceImg.findOne({
        where: { id: device.deviceimg.id },
      });

      let arr;

      for (const [key, value] of Object.entries(JSON.parse(img))) {
        arr = Array.from(Object.entries(JSON.parse(image.img))).filter(
          (item) => {
            return item[0] != key;
          }
        );
        obj[key] = value;
      }

      arr.map((item) =>
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', item[1]))
      );

      if (files && files.length != 0) {
        for (const [key, value] of Object.entries(files)) {
          const filename = uuid.v4() + '.png';
          value.mv(path.resolve(__dirname, '..', 'static', filename));
          obj[value.name] = filename;
        }
      }

      await image.update({ img: JSON.stringify(obj) });

      return res.json(image);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const device = await Device.findOne({
        where: {
          id,
        },
        include: [
          {
            model: DeviceImg,
            as: 'deviceimg',
          },
        ],
      });
      const image = await DeviceImg.findOne({
        where: { id: device.deviceimg.id },
      });
      image.destroy();
      for (const [key, value] of Object.entries(JSON.parse(image.img))) {
        if (value) {
          fs.unlinkSync(path.resolve(__dirname, '..', 'static', value));
        }
      }

      return res.json(image);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
}

module.exports = new ImageControllers();
