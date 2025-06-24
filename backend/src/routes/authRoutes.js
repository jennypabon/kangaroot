"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// POST /api/auth/login - Company login
router.post('/login', authController_1.login);
// GET /api/auth/verify - Verify JWT token
router.get('/verify', authController_1.verifyToken);
exports.default = router;
