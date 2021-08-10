const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { JWT_SECRET_KEY } = require('../utils/conf');

const { AUTH_ERR } = require('../utils/const_messages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError(AUTH_ERR));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return next(new AuthError(AUTH_ERR));
  }

  req.user = payload;

  return next();
};

// Для авторизации через токен,
// в последнем этапе нужно было настроить авторизацию через хедер и local.storage

/* const cookie = req.cookies.jwt;

if (!cookie) {
  return next(new AuthError(AUTH_ERR));
}

let payload;

try {
  payload = jwt.verify(cookie, JWT_SECRET_KEY);
} catch (err) {
  return next(new AuthError(AUTH_ERR));
} */
