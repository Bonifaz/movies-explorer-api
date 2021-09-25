require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const indexRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/rateLimit');
const { PORTSERVER, ADRESS } = require('./utils/constants');
const errorsHandler = require('./middlewares/errors');

const app = express();
const { PORT = PORTSERVER } = process.env;

mongoose.connect(ADRESS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.use(express.json());
app.use(limiter);
app.use(helmet());

app.use('/', indexRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log('start server');
});
