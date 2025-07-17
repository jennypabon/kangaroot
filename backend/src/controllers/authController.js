"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Validation
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son obligatorios'
            });
            return;
        }
        // Find company by admin username
        const companyQuery = `
      SELECT 
        id, company_name, admin_username, password_hash, email, 
        phone, address, tax_id, website, is_active, created_at
      FROM companies 
      WHERE admin_username = $1 AND is_active = true
    `;
        const result = yield database_1.default.query(companyQuery, [username]);
        if (result.rows.length === 0) {
            res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
            return;
        }
        const company = result.rows[0];
        // Check password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, company.password_hash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            companyId: company.id,
            adminUsername: company.admin_username,
            email: company.email
        }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
        // Update last login (optional)
        yield database_1.default.query('UPDATE companies SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [company.id]);
        // Return success response (without password hash)
        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                company: {
                    id: company.id,
                    companyName: company.company_name,
                    adminUsername: company.admin_username,
                    email: company.email,
                    phone: company.phone,
                    address: company.address,
                    taxId: company.tax_id,
                    website: company.website,
                    createdAt: company.created_at
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});
exports.login = login;
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        // Get company data
        const result = yield database_1.default.query('SELECT id, company_name, admin_username, email, phone, address, tax_id, website FROM companies WHERE id = $1 AND is_active = true', [decoded.companyId]);
        if (result.rows.length === 0) {
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
            return;
        }
        const company = result.rows[0];
        res.json({
            success: true,
            data: {
                company: {
                    id: company.id,
                    companyName: company.company_name,
                    adminUsername: company.admin_username,
                    email: company.email,
                    phone: company.phone,
                    address: company.address,
                    taxId: company.tax_id,
                    website: company.website
                }
            }
        });
    }
    catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
});
exports.verifyToken = verifyToken;
