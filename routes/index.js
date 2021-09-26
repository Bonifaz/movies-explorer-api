const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { NOTFOUNDPATHMESSAGE } = require('../utils/constants');
const { createUser, login } = require('../controllers/users');
const { validate } = require('../utils/validate');

router.post('/signin', validate.signin, login);

router.post('/signup', validate.signup, createUser);

router.use(auth);
router.use('/', movieRouter);
router.use('/', userRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError(NOTFOUNDPATHMESSAGE));
});

module.exports = router;
