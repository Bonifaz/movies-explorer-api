require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const indexRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORTSERVER, ADRESS, NODE_ENV } = require('./utils/constants');
const errorsHandler = require('./middlewares/errors');
const cors = require('cors');

const app = express();
const { PORT = PORTSERVER } = process.env;
const adressBD = NODE_ENV === 'production' ? ADRESS : 'mongodb://localhost:27017/bitfilmsdb';
mongoose.connect(adressBD, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.options('*', cors());

app.use(cors({
  origin: ['http://eldiplomafrontendo.nomoredomains.monster', 'https://eldiplomafrontendo.nomoredomains.monster', 'http://localhost:3000', 'https://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(requestLogger);
app.use(express.json());
app.use(helmet());

app.use('/', indexRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log('start server');
});
