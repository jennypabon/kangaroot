import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

interface LoginData {
  username: string;
  password: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: LoginData = req.body;

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

    const result = await pool.query(companyQuery, [username]);

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
      return;
    }

    const company = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, company.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        companyId: company.id,
        adminUsername: company.admin_username,
        email: company.email
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Update last login (optional)
    await pool.query(
      'UPDATE companies SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [company.id]
    );

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

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    // Get company data
    const result = await pool.query(
      'SELECT id, company_name, admin_username, email, phone, address, tax_id, website FROM companies WHERE id = $1 AND is_active = true',
      [decoded.companyId]
    );

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

  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};