"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controllers/companyController");
const router = (0, express_1.Router)();
// POST /api/companies - Register a new company
router.post('/', companyController_1.registerCompany);
// GET /api/companies - Get all companies (for admin purposes)
router.get('/', companyController_1.getCompanies);
// PUT /api/companies/:id - Update company data
router.put('/:id', companyController_1.updateCompany);
exports.default = router;
