const APIError = require('../errors/APIError');
const { DeviceImg, Device, User } = require('../models/mapping');
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
      const { id, img, change = false } = req.body;
      const obj = {};
      const user = await User.findOne({
        where: { id: req.signedCookies.userId },
      });
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

      if (device.change || change || user.role == 'Admin') {
        const image = await DeviceImg.findOne({
          where: { id: device.deviceimgId },
        });

        const imgArr = Object.entries(JSON.parse(img));

        let arr = [];

        for (const [key, value] of Object.entries(JSON.parse(image.img))) {
          if (Array.from(imgArr).length > 0) {
            const preve = Array.from(imgArr).reduce((pre, item) => {
              if (key != item[0] && pre != 1) {
                pre = value;
              } else {
                pre = 1;
              }
              return pre;
            }, 0);

            if (preve == 1) {
              obj[key] = value;
            } else {
              arr.push(preve);
            }
          } else {
            arr.push(value);
          }
        }

        if (arr.length > 0) {
          arr.map((item) =>
            fs.unlinkSync(path.resolve(__dirname, '..', 'static', item))
          );
        }
        if (files && files.length != 0) {
          for (const [key, value] of Object.entries(files)) {
            const filename = uuid.v4() + '.png';
            value.mv(path.resolve(__dirname, '..', 'static', filename));
            obj[value.name] = filename;
          }
        }

        await image.update({ img: JSON.stringify(obj) });
        return res.json(image);
      } else {
        return next(APIError.badRequest('product will not be cahnge'));
      }
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }
  //   async delete(req, res, next) {
  //     try {
  //       const { id } = req.params;

  //       const device = await Device.findOne({
  //         where: {
  //           id,
  //         },
  //         include: [
  //           {
  //             model: DeviceImg,
  //             as: 'deviceimg',
  //           },
  //         ],
  //       });
  //       const user = await User.findOne({
  //         where: { id: req.signedCookies.userId },
  //       });
  //       if (device.change || change || user.role == 'Admin') {
  //         const image = await DeviceImg.findOne({
  //           where: { id: device.deviceimg.id },
  //         });
  //         image.destroy();
  //         for (const [key, value] of Object.entries(JSON.parse(image.img))) {
  //           if (value) {
  //             fs.unlinkSync(path.resolve(__dirname, '..', 'static', value));
  //           }
  //         }

  //         return res.json(image);
  //       } else {
  //         return next(APIError.badRequest('product will not be cahnge'));
  //       }
  //     } catch (error) {
  //       return next(APIError.badRequest(error.message));
  //     }
  //   }
}

module.exports = new ImageControllers();
