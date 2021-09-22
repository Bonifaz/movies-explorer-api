const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const ServerError = require('../errors/ServerError');
const Forbidden = require('../errors/Forbidden');

const getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId }).then((movies) => {
    res.status(200).send(movies);
  })
    .catch(() => {
      next(new ServerError('Ошибка сервера'));
    });
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })

    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректно внесены данные.'));
      }

      next(new ServerError('Ошибка сервера'));
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм не найден'));
      } else if (movie.owner._id.toString() === owner) {
        movie.remove().then(() => {
          res.status(200).send(movie);
        })
          .catch((err) => {
            console.log(err);
            next(new ServerError('Ошибка сервера'));
          });
      } else {
        next(new Forbidden('Нельзя удалять чужие фильмы'));
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректно внесены данные'));
      } else {
        next(new ServerError('Ошибка сервера'));
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
