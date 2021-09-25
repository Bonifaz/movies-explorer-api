const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const Forbidden = require('../errors/Forbidden');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.payload._id }).then((movies) => res.status(200).send(movies))
    .catch(next);
};

// Функция создания фильма
const createMovie = (req, res, next) => {
  const data = req.body;
  Movie.create({
    country: data.country,
    director: data.director,
    duration: data.duration,
    year: data.year,
    description: data.description,
    image: data.image,
    trailer: data.trailer,
    nameRU: data.nameRU,
    nameEN: data.nameEN,
    thumbnail: data.thumbnail,
    movieId: data.movieId,
    owner: req.user.payload._id,
  })
    .then((movie) => {
      console.log(movie.owner);
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Данные введены неверно'));
      } else if (err.code === 11000) {
        const error = new Error('Нельзя добавить уже существующий фильм');
        error.statusCode = 409;
        next(error);
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user.payload._id;
  Movie.findById({ _id: req.params.movieId })
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (movie.owner._id.toString() !== owner) {
        next(new Forbidden('Нельзя удалять чужие фильмы'));
      } else {
        movie.remove().then(() => {
          res.status(200).send(movie)
            .catch(() => {
              next(new ServerError('Ошибка на сервере'));
            });
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные введены неверно'));
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
