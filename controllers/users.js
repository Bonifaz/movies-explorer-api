const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');
const ServerError = require('../errors/ServerError');

const getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Unauthorized('Неправильный логин или пароль.'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Данные не найдены'));
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Некоректные данные или формат данных'));
      } else {
        next(new ServerError('Ошибка сервера'));
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      next(new Conflict('Пользователь с таким email существует'));
    }
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          name, email, password: hash,
        })
          .then(() => {
            res.status(200).send({
              _id: user._id,
              name: user.name,
              email: user.email,
            });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequest('Некорректно переданы данные'));
            }
            next(new ServerError('Ошибка сервера'));
          });
      })
      .catch(() => {
        next(new ServerError('Ошибка сервера'));
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Некорректный email или пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((mathed) => {
          if (!mathed) {
            next(new Unauthorized('Некорректный email или пароль.'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      return res
        .status(201)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({ message: 'Авторизация пройдена!', token });
    })
    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new Unauthorized('Некорректный email или пароль.'));
      }
      next(new ServerError('Ошибка сервера'));
    });
};

module.exports = {
  getUsersMe, updateUser, createUser, login,
};
