import { Router } from 'express';
import { registerCompany, getCompanies, updateCompany } from '../controllers/companyController';

const router = Router();

// POST /api/companies - Register a new company
router.post('/', registerCompany);

// GET /api/companies - Get all companies (for admin purposes)
router.get('/', getCompanies);

// PUT /api/companies/:id - Update company data
router.put('/:id', updateCompany);

export default router;