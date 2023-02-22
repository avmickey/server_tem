const { DataTypes } = require('sequelize');
const sequelize = require('../bd');

const UserFiles = sequelize.define('userfiles', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  number: { type: DataTypes.STRING, unique: true },
  login: { type: DataTypes.STRING, unique: true },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  login: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true },
});

const DeviceImg = sequelize.define('deviceimg', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.JSON, allowNull: false },
});

const BasketDevice = sequelize.define('basketDevice', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const Favorite = sequelize.define('favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const FavoriteDevice = sequelize.define('favoriteDevice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  price: { type: DataTypes.DECIMAL, allowNull: false },
  sale: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  change: { type: DataTypes.BOOLEAN, defaultValue: true },
  info: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
});

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
});

const Likes = sequelize.define('likes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantityLike: { type: DataTypes.INTEGER, defaultValue: 0 },
  quantityDis: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const LikeComment = sequelize.define('likecomment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const DisLikeComment = sequelize.define('dislike', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// const DeviceInfo = sequelize.define('deviceInfo', {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   tittle: { type: DataTypes.STRING, allowNull: false },
//   description: { type: DataTypes.STRING, allowNull: false },
// });

const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Color = sequelize.define('color', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  color: { type: DataTypes.STRING, allowNull: false },
});

const TypeBrand = sequelize.define('typeBrand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
});

Basket.belongsToMany(Device, { through: BasketDevice, onDelete: 'CASCADE' });
Device.belongsToMany(Basket, { through: BasketDevice, onDelete: 'CASCADE' });

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);
Device.hasMany(Rating);
Rating.belongsTo(Device);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);
Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Favorite.belongsToMany(Device, {
  through: FavoriteDevice,
  onDelete: 'CASCADE',
});
Device.belongsToMany(Favorite, {
  through: FavoriteDevice,
  onDelete: 'CASCADE',
});

User.hasOne(Favorite);
Favorite.belongsTo(User);

Favorite.hasMany(FavoriteDevice);
FavoriteDevice.belongsTo(Favorite);
Device.hasMany(FavoriteDevice);
FavoriteDevice.belongsTo(Device);

User.hasMany(Comment);
Comment.belongsTo(User);
Device.hasMany(Comment);
Comment.belongsTo(Device);

Comment.hasOne(Likes);
Likes.belongsTo(Comment);
Likes.hasMany(DisLikeComment);
DisLikeComment.belongsTo(Likes);
Likes.hasMany(LikeComment);
LikeComment.belongsTo(Likes);
User.hasMany(LikeComment);
LikeComment.belongsTo(User);
User.hasMany(DisLikeComment);
DisLikeComment.belongsTo(User);

Type.hasMany(Device);
Device.belongsTo(Type);

DeviceImg.hasMany(Device);
Device.belongsTo(DeviceImg);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Color.hasMany(Device);
Device.belongsTo(Color);

// Device.hasMany(DeviceInfo, { as: 'info' });
// DeviceInfo.belongsTo(Device);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

Color.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Color, { through: TypeBrand });

Type.belongsToMany(Color, { through: TypeBrand });
Color.belongsToMany(Type, { through: TypeBrand });

module.exports = {
  User,
  Comment,
  LikeComment,
  DeviceImg,
  UserFiles,
  Device,
  TypeBrand,
  Brand,
  //   DeviceInfo,
  Basket,
  BasketDevice,
  Type,
  Favorite,
  FavoriteDevice,
  Color,
  DisLikeComment,
  LikeComment,
  Likes,
  Rating,
};
