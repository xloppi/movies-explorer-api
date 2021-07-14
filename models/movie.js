const mongoose = require('mongoose');
const { isURL } = require('validator');

const validateURL = (value) => isURL(value, { message: 'invalid URL', require_protocol: true });

const userSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: (v) => validateURL(v),
  },
  trailer: {
    type: String,
    required: true,
    validate: (v) => validateURL(v),
  },
  thumbnail: {
    type: String,
    required: true,
    validate: (v) => validateURL(v),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', userSchema);
