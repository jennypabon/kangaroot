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
exports.updateCompany = exports.getCompanies = exports.registerCompany = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const registerCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, adminUsername, password, email, phone, address, taxId, website } = req.body;
    try {
        // Validation
        if (!companyName || !adminUsername || !password || !email || !phone || !address || !taxId) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos obligatorios deben ser completados'
            });
            return;
        }
        // Check if company already exists (by email, username, or tax_id)
        const existingCompany = yield database_1.default.query('SELECT id FROM companies WHERE email = $1 OR admin_username = $2 OR tax_id = $3', [email, adminUsername, taxId]);
        if (existingCompany.rows.length > 0) {
            res.status(409).json({
                success: false,
                message: 'Ya existe una empresa con ese email, usuario o número fiscal'
            });
            return;
        }
        // Hash password
        const saltRounds = 10;
        const passwordHash = yield bcryptjs_1.default.hash(password, saltRounds);
        // Insert new company
        const insertQuery = `
      INSERT INTO companies (
        company_name, admin_username, password_hash, email, 
        phone, address, tax_id, website
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, company_name, admin_username, email, phone, address, tax_id, website, created_at
    `;
        const result = yield database_1.default.query(insertQuery, [
            companyName,
            adminUsername,
            passwordHash,
            email,
            phone,
            address,
            taxId,
            website || null
        ]);
        const newCompany = result.rows[0];
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            companyId: newCompany.id,
            adminUsername: newCompany.admin_username,
            email: newCompany.email
        }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
        res.status(201).json({
            success: true,
            message: 'Empresa registrada exitosamente',
            data: {
                company: {
                    id: newCompany.id,
                    companyName: newCompany.company_name,
                    adminUsername: newCompany.admin_username,
                    email: newCompany.email,
                    phone: newCompany.phone,
                    address: newCompany.address,
                    taxId: newCompany.tax_id,
                    website: newCompany.website,
                    createdAt: newCompany.created_at
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Error registering company:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al registrar la empresa'
        });
    }
});
exports.registerCompany = registerCompany;
const getCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query(`
      SELECT id, company_name, admin_username, email, phone, address, tax_id, website, is_active, created_at
      FROM companies 
      WHERE is_active = true
      ORDER BY created_at DESC
    `);
        res.json({
            success: true,
            data: result.rows.map(company => ({
                id: company.id,
                companyName: company.company_name,
                adminUsername: company.admin_username,
                email: company.email,
                phone: company.phone,
                address: company.address,
                taxId: company.tax_id,
                website: company.website,
                isActive: company.is_active,
                createdAt: company.created_at
            }))
        });
    }
    catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al obtener las empresas'
        });
    }
});
exports.getCompanies = getCompanies;
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.params.id;
    const { companyName, adminUsername, email, phone, address, taxId, website } = req.body;
    try {
        // Validation
        if (!companyName || !adminUsername || !email || !phone || !address || !taxId) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos obligatorios deben ser completados'
            });
            return;
        }
        // Check if company exists
        const existingCompany = yield database_1.default.query('SELECT id FROM companies WHERE id = $1 AND is_active = true', [companyId]);
        if (existingCompany.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
            return;
        }
        // Check if email, username, or tax_id are already taken by another company
        const duplicateCheck = yield database_1.default.query('SELECT id FROM companies WHERE (email = $1 OR admin_username = $2 OR tax_id = $3) AND id != $4', [email, adminUsername, taxId, companyId]);
        if (duplicateCheck.rows.length > 0) {
            res.status(409).json({
                success: false,
                message: 'Ya existe otra empresa con ese email, usuario o número fiscal'
            });
            return;
        }
        // Update company
        const updateQuery = `
      UPDATE companies 
      SET 
        company_name = $1,
        admin_username = $2,
        email = $3,
        phone = $4,
        address = $5,
        tax_id = $6,
        website = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, company_name, admin_username, email, phone, address, tax_id, website, created_at, updated_at
    `;
        const result = yield database_1.default.query(updateQuery, [
            companyName,
            adminUsername,
            email,
            phone,
            address,
            taxId,
            website || null,
            companyId
        ]);
        const updatedCompany = result.rows[0];
        res.json({
            success: true,
            message: 'Empresa actualizada exitosamente',
            data: {
                company: {
                    id: updatedCompany.id,
                    companyName: updatedCompany.company_name,
                    adminUsername: updatedCompany.admin_username,
                    email: updatedCompany.email,
                    phone: updatedCompany.phone,
                    address: updatedCompany.address,
                    taxId: updatedCompany.tax_id,
                    website: updatedCompany.website,
                    createdAt: updatedCompany.created_at,
                    updatedAt: updatedCompany.updated_at
                }
            }
        });
    }
    catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar la empresa'
        });
    }
});
exports.updateCompany = updateCompany;
