const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');
const { generateToken } = require('../utils/jwt');
const {
  NOTFOUNDMESSAGE, CONFLICTMESSAGE, BADREQUESTMESSAGE, UNAUTHORIZEDMESSAGE,
} = require('../utils/constants');

// Информация о себе
const getUser = (req, res, next) => {
  User.findById(req.user.payload._id)
    .orFail(() => {
      throw new NotFoundError(NOTFOUNDMESSAGE);
    })
    .then((user) => {
      res.status(200).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

// Функция создания пользователя
const createUser = (req, res, next) => {
  const data = req.body;
  if (!data.password) {
    throw new BadRequest(BADREQUESTMESSAGE);
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: data.email,
      password: hash,
      name: data.name,
    }))
    .then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(CONFLICTMESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(BADREQUESTMESSAGE));
      } else {
        next(err);
      }
    });
};

// Обновление данных пользователя
const updateUser = (req, res, next) => User.findByIdAndUpdate(req.user.payload._id, req.body,
  { new: true, runValidators: true })
  .orFail(() => {
    throw new NotFoundError(NOTFOUNDMESSAGE);
  })
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.code === 11000) {
      next(new Conflict(CONFLICTMESSAGE));
    } else if (err.name === 'ValidationError') {
      next(new BadRequest(BADREQUESTMESSAGE));
    } else {
      next(err);
    }
  })
  .catch((err) => {
    next(err);
  });

// Функция логин
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new Unauthorized(UNAUTHORIZEDMESSAGE);
    })
    .then((user) => ({
      user,
      isPasswordEqual: bcrypt.compareSync(password, user.password),
    }))
    .then(({ user, isPasswordEqual }) => {
      if (!isPasswordEqual) {
        throw new Unauthorized(UNAUTHORIZEDMESSAGE);
      }
      const token = generateToken({ _id: user._id });
      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser, updateUser, createUser, login,
};
