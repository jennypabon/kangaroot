import { Router } from 'express';
import { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicleController';
import { authenticateCompany } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateCompany);

// Routes
router.post('/', createVehicle);
router.get('/', getVehicles);
router.get('/:id', getVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;