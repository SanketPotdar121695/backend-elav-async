const { Router } = require('express');
const { userRegister, userLogin } = require('../controllers/user.controllers');

const userRouter = Router();

userRouter.post('/register', userRegister);
userRouter.post('/login', userLogin);

module.exports = { userRouter };
