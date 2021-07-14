const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;

  if (!cookie) {
    return next(new AuthError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(cookie, NODE_ENV === 'production' ? JWT_SECRET : 'superpupernikogdanepodbereshkey');
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
