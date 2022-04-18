const { Router } = require('express');
const authController = require('../controllers/authController');

const authRouter = Router();

authRouter.get('/signup', authController.signup_get);
authRouter.post('/signup', authController.signup_post);

authRouter.get('/login', authController.login_get);
authRouter.post('/login', authController.login_post);

//authRouter.get('/profile', authController.profile_get);
//authRouter.get('/profile/edit', authController.profileEdit_get);
//authRouter.post('/profile/edit', authController.profileEdit_post);

authRouter.get('/logout', authController.logout_get);

module.exports = authRouter;
