const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');

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
        return next(new ValidationError('Переданы некорректные данные при создании карточки фильма'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }

      if (userId !== movie.owner.toString()) {
        throw new ForbiddenError('Пользователь не является владельцем фильма');
      }

      return Movie.remove({ _id: req.params.movieId })
        .then(() => res.status(200).send({ message: 'фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('ошибка валидации movieId'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
