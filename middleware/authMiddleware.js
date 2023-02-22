const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(405).json({ message: 'Не авторизован' });
    }
    const decoded = jwt.verify(token, config.get('secretKey'));
    req.user = decoded;
    next();
  } catch (e) {
    res.status(403).json({ message: 'Не авторизован' });
  }
};
