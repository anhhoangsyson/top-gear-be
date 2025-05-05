import { Router } from 'express';
import { authController } from '../controller/auth.controller';
import '../../../../docs/auth.swagger.js'; // Đảm bảo rằng đường dẫn này đúng
import { validationesUsers } from '../../../middlewares/validations/validations.middlewares';
// import  passport from '../../../config/passport/passport.config';
import passport from 'passport';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';
const authRouter = Router();
const controller = new authController();

// Endpoint để đăng ký người dùng
authRouter.post('/register', (req, res) => {
  controller.register(req, res);
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

export default authRouter;
