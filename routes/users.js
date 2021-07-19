const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isEmail } = require('validator');

const {
  updateProfile,
  getMe,
} = require('../controllers/users');

router.get('/me', getMe);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (isEmail(value)) {
        return value;
      }
      return helpers.error('any.invalid');
    }),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

module.exports = router;
