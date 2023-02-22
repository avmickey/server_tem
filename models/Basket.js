const { Basket, BasketDevice, Device, Brand } = require('./mapping.js');
const APIError = require('../errors/APIError.js');

const pretty = (basket) => {
  const data = {};
  data.id = basket.id;
  data.devices = [];
  if (basket.devices) {
    data.devices = basket.devices.map((item) => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.basketDevice.quantity,
        brand: item.brand,
        sale: item.sale,
      };
    });
  }

  return data;
};

class BasketModel {
  async getOne(userId) {
    const basketId = await Basket.findOne({ where: { userId } });
    let basket = await Basket.findByPk(basketId.id, {
      attributes: ['id'],
      include: [
        {
          model: Device,
          attributes: ['id', 'name', 'price', 'sale'],
          include: [{ model: Brand, as: 'brand' }],
        },
      ],
    });

    if (!basket) {
      basket = await Basket.create({ userId });
    }

    return pretty(basket);
  }
  // !==================================================================================================
  async create(id) {
    const basket = await Basket.create({ userId: id });
    return pretty(basket);
  }
  // !==================================================================================================
  async append(userId, deviceId, quantity) {
    const basketId = await Basket.findOne({ where: { userId } });
    let basket = await Basket.findByPk(basketId.id, {
      attributes: ['id'],
      include: [
        {
          model: Device,
          attributes: ['id', 'name', 'price', 'sale'],
          include: [{ model: Brand, as: 'brand' }],
        },
      ],
    });
    if (!basket) {
      basket = await Basket.create({ userId });
    }

    const basketDevice = await BasketDevice.findOne({
      where: { basketId: basketId.id, deviceId },
    });
    if (basketDevice) {
      await basketDevice.increment('quantity', { by: quantity });
    } else {
      await BasketDevice.create({ basketId: basketId.id, deviceId, quantity });
    }

    await basket.reload();
    return pretty(basket);
  }
  // !==================================================================================================
  async increment(userId, deviceId, quantity) {
    const basketId = await Basket.findOne({ where: { userId } });
    let basket = await Basket.findByPk(basketId.id, {
      attributes: ['id'],
      include: [
        {
          model: Device,
          attributes: ['id', 'name', 'price', 'sale'],
          include: [{ model: Brand, as: 'brand' }],
        },
      ],
    });

    if (!basket) {
      basket = await Basket.create({ userId });
    }

    const basketDevice = await BasketDevice.findOne({
      where: { basketId: basketId.id, deviceId },
    });
    if (basketDevice) {
      await basketDevice.increment('quantity', { by: quantity });

      await basket.reload();
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async decrement(userId, deviceId, quantity) {
    const basketId = await Basket.findOne({ where: { userId } });
    let basket = await Basket.findByPk(basketId.id, {
      attributes: ['id'],
      include: [
        {
          model: Device,
          attributes: ['id', 'name', 'price', 'sale'],
          include: [{ model: Brand, as: 'brand' }],
        },
      ],
    });
    if (!basket) {
      basket = await Basket.create({ userId });
    }

    const basketDevice = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    });
    if (basketDevice) {
      if (basketDevice.quantity > quantity) {
        await basketDevice.decrement('quantity', { by: quantity });
      } else {
        await basketDevice.destroy();
      }
      await basket.reload();
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async remove(userId, deviceId) {
    const basketId = await Basket.findOne({ where: { userId } });
    let basket = await Basket.findByPk(basketId.id, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (!basket) {
      basket = await Basket.create({ userId });
    }
    // проверяем, есть ли этот товар в корзине
    const basketDevice = await BasketDevice.findOne({
      where: { basketId: basket.id, deviceId },
    });
    if (basketDevice) {
      await basketDevice.destroy();

      await basket.reload();
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async clear(userId) {
    const basketId = await Basket.findOne({ where: { userId } });
    let basket = await Basket.findByPk(basketId.id, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (basket) {
      await BasketDevice.destroy({ where: { basketId: basketId.id } });

      await basket.reload();
    } else {
      basket = await Basket.create({ userId });
    }
    return pretty(basket);
  }
  // !==================================================================================================
  async delete(userId) {
    const basketId = await Basket.findOne({ where: { userId } });
    let basket = await Basket.findByPk(basketId.id, {
      include: [{ model: Device, as: 'devices' }],
    });
    if (!basket) {
      throw new Error('Cart not found in database');
    }
    await basket.destroy();
    return pretty(basket);
  }
}

module.exports = new BasketModel();
