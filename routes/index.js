const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}),
login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}),
createUser);

router.use(auth);
router.use('/', userRouter);
router.use('/', movieRouter);

module.exports = router;
