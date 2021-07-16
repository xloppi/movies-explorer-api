const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');
const {
  INVALID_DATA_MOVIE,
  MOVIE_NOT_FOUND,
  NOT_OWNER_MOVIE,
  MOVIE_DELETE,
  ERR_VAL_MOVIEID,
} = require('../utils/const_messages');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(INVALID_DATA_MOVIE));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MOVIE_NOT_FOUND);
      }

      if (userId !== movie.owner.toString()) {
        throw new ForbiddenError(NOT_OWNER_MOVIE);
      }

      return Movie.remove({ _id: req.params.movieId })
        .then(() => res.status(200).send({ message: MOVIE_DELETE }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError(ERR_VAL_MOVIEID));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
