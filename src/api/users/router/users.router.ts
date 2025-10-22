import { Router } from 'express';
import { UsersController } from '../controller/users.controller';
import '../../../../docs/users.swagger.js';
import { validationesUsers } from '../../../middlewares/validations/validations.middlewares';
import checkrole from '../../../middlewares/user/user.misddewares';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';
import { roleUsers } from '../../../constants/users/role/role_users.constants';
const usersRouter = Router();
const usersController = new UsersController();
usersRouter.get(
  '/',
  // authenticateJWT,
  // checkrole([roleUsers.ADMIN]),
  (req, res) => {
    usersController.getAllUsers(req, res);
  },
);
usersRouter.post('/', (req, res) => {
  usersController.createUsers(req, res);
});
usersRouter.get('/:id', (req, res) => {
  usersController.getUsersById(req, res);
});
usersRouter.delete('/:id', (req, res) => {
  usersController.deleteById(req, res);
});
usersRouter.put('/profile', authenticateJWT, (req, res) => {
  usersController.updateProfile(req, res);
});
export default usersRouter;
