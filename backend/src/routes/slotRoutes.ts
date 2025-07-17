import { Router } from 'express';
import { createSlot, getSlotsByVehicle, getSlot, updateSlot, deleteSlot } from '../controllers/slotController';
import { authenticateCompany } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateCompany);

// Routes
router.post('/', createSlot);
router.get('/vehicle/:vehicleId', getSlotsByVehicle);
router.get('/:id', getSlot);
router.put('/:id', updateSlot);
router.delete('/:id', deleteSlot);

export default router;