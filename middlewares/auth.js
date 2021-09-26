const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const { UNAUTHORIZEDAUTHMESSAGE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const { JWT = NODE_ENV === 'production' ? JWT_SECRET : 'penumbra' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: UNAUTHORIZEDAUTHMESSAGE });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT);
  } catch (err) {
    next(new Unauthorized(UNAUTHORIZEDAUTHMESSAGE));
  }

  req.user = payload;

  return next();
};
