import { Router } from 'express';
import { authController } from '../controller/auth.controller';
import '../../../../docs/auth.swagger.js'; // Đảm bảo rằng đường dẫn này đúng
import { validationesUsers } from '../../../middlewares/validations/validations.middlewares';
// import  passport from '../../../config/passport/passport.config';
import passport from 'passport';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';
import { validateRegister } from '../../../middlewares/validations/auth.validation';
const authRouter = Router();
const controller = new authController();

// Endpoint để đăng ký người dùng
authRouter.post('/register', validateRegister, (req, res, next) => {
  controller.register(req, res, next);
});

// Endpoint để đăng nhập người dùng
authRouter.post('/login', (req, res, next) => {
  controller.login(req, res, next);
});

authRouter.get('/me', authenticateJWT, (req, res) => {
  controller.me(req, res);
});

authRouter.put('/me/edit', authenticateJWT, (req, res) => {
  controller.editAccount(req, res);
});

authRouter.post('/facebook', (req, res, next) => {
  controller.facebookAuth(req, res, next);
});

authRouter.get('/users', authenticateJWT, (req, res, next) => {
  controller.getAllUsers(req, res, next);
});
export default authRouter;
