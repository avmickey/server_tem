const { UserFiles } = require('../models/mapping');
const jwt = require('jsonwebtoken');
const path = require('path');
const config = require('config');
const bcrypt = require('bcrypt');
const APIError = require('../errors/APIError');

const generateJwt = (id, email, role, login) => {
  return jwt.sign({ id, email, role, login }, config.get('secretKey'), {
    expiresIn: '24h',
  });
};

class UserFilesControllers {
  async registration(req, res, next) {
    try {
      const { email, password, number, login, role } = req.body;
      if (!email || !password) {
        return next(APIError.badRequest('Не указан email'));
      }
      const candidata = await UserFiles.findOne({ where: { email } });
      if (candidata) {
        return next(APIError.badRequest('Данный email уже существует'));
      }
      const userNumber = await UserFiles.findOne({ where: { number } });
      if (userNumber) {
        return next(APIError.badRequest('Данный номер уже существует'));
      }
      const userLogin = await UserFiles.findOne({ where: { login } });
      if (userLogin) {
        return next(APIError.badRequest('Данный логин уже существует'));
      }

      const hashPass = await bcrypt.hash(password, 5);
      const user = await UserFiles.create({
        password: hashPass,
        email,
        role,
        number,
        login,
      });
      const token = generateJwt(user.id, user.email, user.role, user.login);
      return res.json({ message: 'Ok', token, user });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      let user = await UserFiles.findOne({ where: { email } });
      const number = await UserFiles.findOne({
        where: { number: email },
      });

      if (!user && !number) {
        return next(APIError.badRequest('логин или email не найден'));
      } else if (number) {
        user = number;
      }
      const comparePass = bcrypt.compareSync(password, user.password);
      if (!comparePass) {
        return next(APIError.badRequest('неверный пароль'));
      }
      const token = generateJwt(user.id, user.email, user.role, user.login);
      return res.json({ message: 'Ok', token, user });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }
  async check(req, res, next) {
    const token = generateJwt(user.id, user.email, user.role, user.login);
    const user = await UserFiles.findOne({ where: { login: req.user.login } });
    if (user) {
      res.cookie('userId', user.id, {
        maxAge,
        signed: true,
        // sameSite: 'Strict',

        //    secure: true,
      });
      res.json({ token, user });
    } else {
      return res.status(405).json({ message: 'Не авторизован' });
    }
  }
}

module.exports = new UserFilesControllers();
