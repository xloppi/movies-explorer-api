const mongoose = require('mongoose');
const { isURL } = require('validator');

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
    validate: [isURL({ require_protocol: true }), 'invalid URL'],
  },
  trailer: {
    type: String,
    required: true,
    validate: [isURL({ require_protocol: true }), 'invalid URL'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [isURL({ require_protocol: true }), 'invalid URL'],
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
