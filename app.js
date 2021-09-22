require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const errorsHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const index = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(requestLogger);

/* coment */
app.use(index);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Не удалось найти страницу'));
});

app.listen(PORT);
