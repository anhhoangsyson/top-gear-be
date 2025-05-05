import { Router } from 'express';
import { LocationController } from '../controller/location.controller';
import authenticateJWT from '../../../middlewares/authenticate/authenticateJWT';

const locationRouter = Router();
const locationController = new LocationController();

locationRouter.get('/', authenticateJWT, (req, res) => {
  locationController.getLocationsByUserId(req, res);
});

locationRouter.post('/', authenticateJWT, (req, res) => {
  locationController.createLocation(req, res);
});

locationRouter.delete('/delete/:id', authenticateJWT, (req, res) => {
  locationController.deleteLocation(req, res);
});

locationRouter.put('/set-default/:id', authenticateJWT, (req, res) => {
  locationController.setDefaultLocation(req, res);
});

locationRouter.put('/update/:id', authenticateJWT, (req, res) => {
  locationController.updateLocation(req, res);
});

export default locationRouter;
