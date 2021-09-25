const errorsHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const response = err.message || 'Ошибка на сервере';

  res.status(status).send({ response });

  next();
};

module.exports = errorsHandler;
