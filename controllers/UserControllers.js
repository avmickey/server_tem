const { User, Basket, Favorite } = require('../models/mapping');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config');
const APIError = require('../errors/APIError');
const maxAge = 60 * 60 * 1000 * 24 * 365; // один год

const generateJwt = (id, email, role, login) => {
  return jwt.sign({ id, email, role, login }, config.get('secretKey'), {
    expiresIn: '24h',
  });
};

class UserControllers {
  async registration(req, res, next) {
    try {
      const { email, password, number, login, role, firstName, lastName } =
        req.body;
      if (!email || !password) {
        return next(APIError.badRequest('Email not specified'));
      }
      const candidata = await User.findOne({ where: { email } });
      if (candidata) {
        return next(APIError.badRequest('This email already exists'));
      }
      const userNumber = await User.findOne({ where: { number } });
      if (userNumber) {
        return next(APIError.badRequest('This number already exists'));
      }
      const userLogin = await User.findOne({ where: { login } });
      if (userLogin) {
        return next(APIError.badRequest('This login already exists'));
      }

      const hashPass = await bcrypt.hash(password, 5);
      const user = await User.create({
        password: hashPass,
        email,
        role,
        number,
        login,
        firstName,
        lastName,
      });
      const basket = await Basket.create({
        userId: user.id,
      });
      const favorite = await Favorite.create({
        userId: user.id,
      });
      const token = generateJwt(user.id, user.email, user.role, user.login);
      res.cookie('userId', user.id, {
        maxAge,
        signed: true,
        // sameSite: 'Strict',

        //    secure: true,
      });
      res.json({ message: 'Ok', token, user });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async login(req, res, next) {
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
      const token = generateJwt(user.id, user.email, user.role, user.login);
      res.cookie('userId', user.id, {
        maxAge,
        signed: true,
        // sameSite: 'Strict',

        //    secure: true,
      });
      res.json({ message: 'Ok', token, user });
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw new Error('User is not found');
    }
    await user.destroy({ truncate: true, cascade: false });
    return user;
  }

  async getAll(req, res, next) {
    try {
      const user = await User.findAll();
      res.json(user);
    } catch (error) {
      return next(APIError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    try {
      if (req.signedCookies.userId) {
        for (const [key, value] of Object.entries(req.body)) {
          if (key) {
            await User.update(
              {
                [key]: value,
              },
              {
                where: { id: req.signedCookies.userId },
              }
            );
          }
        }
        const user = await User.findOne({
          where: { id: req.signedCookies.userId },
        });

        res.cookie('userId', user.id, {
          maxAge,
          signed: true,
          sameSite: 'Strict',
          secure: true,
        });
        res.json({ message: 'Ok', user });
      } else {
        return next(APIError.badRequest('not found cookies'));
      }
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async updatepass(req, res, next) {
    try {
      const { passwordold, password } = req.body;
      const cookie = req.signedCookies.userId;
      if (passwordold && password && cookie) {
        let user = await User.findOne({
          where: { id: cookie },
        });

        const comparePass = bcrypt.compareSync(passwordold, user.password);

        if (comparePass) {
          const hashPass = await bcrypt.hash(password, 5);
          await User.update(
            {
              password: hashPass,
            },
            {
              where: { id: cookie },
            }
          );
          user.save();
        } else {
          return next(APIError.badRequest('Invalid password'));
        }

        user = await User.findOne({
          where: { id: req.signedCookies.userId },
        });

        const token = generateJwt(user.id, user.email, user.role, user.login);
        res.cookie('userId', user.id, {
          maxAge,
          signed: true,
          sameSite: 'Strict',
          secure: true,
        });
        res.json({ message: 'Ok', token, user });
      } else {
        return next(APIError.badRequest('not found cookies or password'));
      }
    } catch (e) {
      return next(APIError.badRequest(e.message));
    }
  }

  async check(req, res, next) {
    const token = generateJwt(
      req.user.id,
      req.user.email,
      req.user.role,
      req.user.login
    );
    const user = await User.findOne({ where: { login: req.user.login } });

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

  async deletecookie(req, res, next) {
    if (req.signedCookies.userId) {
      res.cookie('userId', req.signedCookies.userId, {
        signed: true,
        sameSite: 'Strict',
        maxAge: 0,
      });
      res.cookie('basketId', req.signedCookies.userId, {
        signed: true,
        sameSite: 'Strict',
        maxAge: 0,
      });
      res.cookie('favoriteId', req.signedCookies.userId, {
        signed: true,
        sameSite: 'Strict',
        maxAge: 0,
      });
    }
    res.send('Cookie has been deleted successfully');
  }
}

module.exports = new UserControllers();
