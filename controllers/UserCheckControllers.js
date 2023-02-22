const { User } = require('../models/mapping');
const bcrypt = require('bcrypt');
const APIError = require('../errors/APIError');

class UserCheckControllers {
  async registration(req, res, next) {
    try {
      const { email, password, number, login } = req.body;
      if (!email || !password) {
        return next(APIError.badRequest('Incorrect email or password'));
      }
      const userEmail = await User.findOne({ where: { email } });
      if (userEmail) {
        return next(APIError.internes('This email already exists'));
      }
      const userNumber = await User.findOne({ where: { number } });
      if (userNumber) {
        return next(APIError.badRequest('This number already exists'));
      }
      const userLogin = await User.findOne({ where: { login } });
      if (userLogin) {
        return next(APIError.badRequest('This login already exists'));
      }
      return res.json({ message: 'Ok' });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async loginCheck(req, res, next) {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ where: { email } });
      const login = await User.findOne({
        where: { login: email },
      });

      if (!user && !login) {
        return next(APIError.badRequest('login or email not found'));
      } else if (login) {
        user = login;
      }

      const comparePass = bcrypt.compareSync(password, user.password);
      if (!comparePass) {
        return next(APIError.badRequest('Invalid password'));
      }

      return res.json({ message: 'Ok', user: user });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async validcode(req, res, next) {
    try {
      return res.json(Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000);
    } catch (e) {
      return next(APIError.bedRequest(e.message));
    }
  }
}

module.exports = new UserCheckControllers();
