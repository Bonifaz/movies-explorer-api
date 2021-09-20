const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const errorsHandler = require('./middlewares/errors');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
const { PORT = 3000 } = process.env;
app.listen(PORT);

app.use(express.json());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}),
login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}),
createUser);

app.use(auth);
app.use('/', userRouter);
app.use('/', movieRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
