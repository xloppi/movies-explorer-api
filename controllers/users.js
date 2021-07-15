const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');
const ValidationError = require('../errors/validation-err');
const ConflictingError = require('../errors/conflicting-request-err');

const { NODE_ENV, JWT_SECRET, SALT_ROUNDS } = process.env;

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt.hash(password, NODE_ENV === 'production' ? Number(SALT_ROUNDS) : 10, (error, hash) => {
    User.findOne({ email })
      .then((userEmail) => {
        if (userEmail) {
          throw new ConflictingError('Такой пользователь уже существует');
        }

        return User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        })
          .then((user) => {
            const newUser = user.toObject();
            delete newUser.password;
            res.status(201).send(newUser);
          });
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
        }
        return next(err);
      });
  });
};

const updateProfile = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  { email: req.body.email, name: req.body.name },
  { new: true, runValidators: true },
)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }
    res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
    }
    return next(err);
  });

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw next(new AuthError('Не правильная почта или пароль'));
      }

      return bcrypt.compare(
        password,
        user.password,
        (err, isValid) => {
          if (!isValid) {
            return next(new AuthError('Не правильная почта или пароль'));
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'superpupernikogdanepodbereshkey',
            { expiresIn: '7d' },
          );
          return res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              SameSite: 'None',
              secure: true,
            })
            .send({ message: 'Авторизация прошла успешно' });
        },
      );
    })
    .catch(next);
};

const logout = (req, res) => res.clearCookie('jwt').send({ message: 'Выход из профиля прошел успешно' });

module.exports = {
  getMe,
  updateProfile,
  login,
  logout,
  createUser,
};
