const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsersMe, updateUser, createUser,
} = require('../controllers/users');

userRouter.get('/users/me', getUsersMe);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

userRouter.post('/users', createUser);

module.exports = userRouter;
