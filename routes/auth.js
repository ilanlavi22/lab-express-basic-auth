const { Router } = require('express');
const authController = require('../controllers/authController');

const authRouter = Router();

authRouter.get('/signup', authController.signup_get);
authRouter.post('/signup', authController.signup_post);

module.exports = authRouter;
