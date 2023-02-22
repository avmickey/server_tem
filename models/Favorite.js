const {
  Device,
  Favorite,
  Brand,
  FavoriteDevice,
  DeviceImg,
  Rating,
} = require('./mapping.js');
const APIError = require('../errors/APIError.js');

const pretty = (favorite) => {
  const data = {};
  data.id = favorite.id;
  data.devices = [];
  if (favorite.devices) {
    data.devices = favorite.devices.map((item) => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        deviceimg: item.deviceimg,
        brand: item.brand,
        ratings: item.ratings,
        sale: item.sale,
      };
    });
  } else {
    data.devices = favorite.favoriteDevices.map((item) => {
      return {
        id: item.device.id,
        name: item.device.name,
        price: item.device.price,
        deviceimg: item.device.deviceimg,
        brand: item.device.brand,
        ratings: item.device.ratings,
        sale: item.device.sale,
      };
    });
  }

  return data;
};

class FavoriteModel {
  async getOne(userId, req) {
    const { _limit } = req.query;
    const favoriteId = await Favorite.findOne({ where: { userId } });
    let favorite;
    if (_limit) {
      favorite = await Favorite.findByPk(favoriteId.id, {
        attributes: ['id'],
        include: [
          {
            model: FavoriteDevice,
            attributes: ['id'],
            separate: true,
            limit: _limit,

            include: [
              {
                model: Device,
                attributes: ['id', 'name', 'price', 'brandId', 'sale'],
                include: [
                  { model: Brand, as: 'brand' },
                  { model: DeviceImg, as: 'deviceimg' },
                  { model: Rating, as: 'ratings' },
                ],
              },
            ],
          },
        ],
      });
    } else {
      favorite = await Favorite.findByPk(favoriteId.id, {
        attributes: ['id'],
        include: [
          {
            model: Device,
            attributes: ['id', 'name', 'price', 'brandId', 'sale'],
            include: [
              { model: Brand, as: 'brand' },
              { model: DeviceImg, as: 'deviceimg' },
              { model: Rating, as: 'ratings' },
            ],
          },
        ],
      });
    }

    if (!favorite) {
      favorite = await Favorite.create(userId);
    }
    return pretty(favorite);
  }
  // !==================================================================================================
  async create(userId) {
    const favorite = await Favorite.create({ userId });
    return pretty(favorite);
  }
  // !==================================================================================================
  async append(userId, deviceId) {
    const favoriteId = await Favorite.findOne({ where: { userId } });
    let favorite = await Favorite.findByPk(favoriteId.id, {
      attributes: ['id'],
      include: [
        {
          model: Device,
          attributes: ['id', 'name', 'price', 'sale'],
          include: [
            { model: Brand, as: 'brand' },
            { model: DeviceImg, as: 'deviceimg' },
            { model: Rating, as: 'ratings' },
          ],
        },
      ],
    });
    if (!favorite) {
      favorite = await Favorite.create(userId);
    }
    const favoriteDevice = await FavoriteDevice.findOne({
      where: { favoriteId: favoriteId.id, deviceId },
    });
    if (favoriteDevice) {
      await FavoriteDevice.destroy({
        where: { favoriteId: favoriteId.id, deviceId },
      });
    } else {
      await FavoriteDevice.create({ favoriteId: favoriteId.id, deviceId });
    }
    await favorite.reload();
    return pretty(favorite);
  }

  // !==================================================================================================
  async delete(userId) {
    const favoriteId = await Favorite.findOne({ where: { userId } });
    const favorite = await Favorite.findByPk(favoriteId.id, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (!favorite) {
      throw new Error('Корзина не найдена в БД');
    }
    await favorite.destroy();
    return pretty(favorite);
  }
}

module.exports = new FavoriteModel();
