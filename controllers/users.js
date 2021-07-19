const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');
const ValidationError = require('../errors/validation-err');
const ConflictingError = require('../errors/conflicting-request-err');
const {
  USER_NOT_FOUND,
  INVALID_UPDATE_PROFILE,
  USER_ALREADY_EX,
  INVALID_DATA_USER,
  LOGIN_NOT_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} = require('../utils/const_messages');

const { NODE_ENV, JWT_SECRET_KEY, SALT_R } = require('../utils/conf');

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFoundError(USER_NOT_FOUND);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError(INVALID_UPDATE_PROFILE));
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

  return bcrypt.hash(password, SALT_R, (error, hash) => {
    User.findOne({ email })
      .then((userEmail) => {
        if (userEmail) {
          throw new ConflictingError(USER_ALREADY_EX);
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
          return next(new ValidationError(INVALID_DATA_USER));
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
      throw new NotFoundError(USER_NOT_FOUND);
    }
    res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new ValidationError(INVALID_UPDATE_PROFILE));
    }
    return next(err);
  });

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw next(new AuthError(LOGIN_NOT_SUCCESS));
      }

      return bcrypt.compare(
        password,
        user.password,
        (err, isValid) => {
          if (!isValid) {
            return next(new AuthError(LOGIN_NOT_SUCCESS));
          }

          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET_KEY,
            { expiresIn: '7d' },
          );
          return res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              SameSite: 'None',
              secure: NODE_ENV === 'production',
            })
            .send({ message: LOGIN_SUCCESS });
        },
      );
    })
    .catch(next);
};

const logout = (req, res) => res.clearCookie('jwt').send({ message: LOGOUT_SUCCESS });

module.exports = {
  getMe,
  updateProfile,
  login,
  logout,
  createUser,
};
