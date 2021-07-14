const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

module.exports = router;
