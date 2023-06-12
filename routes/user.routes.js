const { Router } = require('express');
const { signup, login, logout } = require('../controllers/user.controllers');

const userRouter = Router();

userRouter.post('/register', signup);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

module.exports = { userRouter };
