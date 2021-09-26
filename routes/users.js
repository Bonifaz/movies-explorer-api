const router = require('express').Router();
const { getUser, updateUser, createUser } = require('../controllers/users');
const { validate } = require('../utils/validate');

router.get('/users/me', getUser);
router.patch('/users/me', validate.updateUser, updateUser);

router.post('/users', validate.createUser, createUser);
module.exports = router;
