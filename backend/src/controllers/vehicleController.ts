import { Request, Response } from 'express';
import pool from '../config/database';
import { Vehicle, VehicleRegistrationData, VehicleUpdateData } from '../models/Vehicle';

interface AuthenticatedRequest extends Request {
  company?: any;
}

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { licensePlate, name } = req.body as VehicleRegistrationData;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    if (!licensePlate || !name) {
      res.status(400).json({ error: 'Matrícula y nombre son requeridos' });
      return;
    }

    // Check if license plate already exists for this company
    const existingVehicle = await pool.query(
      'SELECT id FROM vehicles WHERE license_plate = $1 AND company_id = $2 AND is_active = true',
      [licensePlate, companyId]
    );

    if (existingVehicle.rows.length > 0) {
      res.status(409).json({ error: 'Ya existe un vehículo con esta matrícula' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO vehicles (license_plate, name, company_id) VALUES ($1, $2, $3) RETURNING *',
      [licensePlate, name, companyId]
    );

    const vehicle = result.rows[0];
    res.status(201).json({
      message: 'Vehículo creado exitosamente',
      vehicle: {
        id: vehicle.id,
        licensePlate: vehicle.license_plate,
        name: vehicle.name,
        companyId: vehicle.company_id,
        createdAt: vehicle.created_at,
        updatedAt: vehicle.updated_at,
        isActive: vehicle.is_active
      }
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM vehicles WHERE company_id = $1 AND is_active = true ORDER BY created_at DESC',
      [companyId]
    );

    const vehicles = result.rows.map(vehicle => ({
      id: vehicle.id,
      licensePlate: vehicle.license_plate,
      name: vehicle.name,
      companyId: vehicle.company_id,
      createdAt: vehicle.created_at,
      updatedAt: vehicle.updated_at,
      isActive: vehicle.is_active
    }));

    res.json({ vehicles });
  } catch (error) {
    console.error('Error getting vehicles:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM vehicles WHERE id = $1 AND company_id = $2 AND is_active = true',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Vehículo no encontrado' });
      return;
    }

    const vehicle = result.rows[0];
    res.json({
      vehicle: {
        id: vehicle.id,
        licensePlate: vehicle.license_plate,
        name: vehicle.name,
        companyId: vehicle.company_id,
        createdAt: vehicle.created_at,
        updatedAt: vehicle.updated_at,
        isActive: vehicle.is_active
      }
    });
  } catch (error) {
    console.error('Error getting vehicle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { licensePlate, name } = req.body as VehicleUpdateData;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    // Check if vehicle exists and belongs to company
    const existingVehicle = await pool.query(
      'SELECT * FROM vehicles WHERE id = $1 AND company_id = $2 AND is_active = true',
      [id, companyId]
    );

    if (existingVehicle.rows.length === 0) {
      res.status(404).json({ error: 'Vehículo no encontrado' });
      return;
    }

    // Check if license plate already exists for this company (excluding current vehicle)
    if (licensePlate) {
      const duplicateVehicle = await pool.query(
        'SELECT id FROM vehicles WHERE license_plate = $1 AND company_id = $2 AND id != $3 AND is_active = true',
        [licensePlate, companyId, id]
      );

      if (duplicateVehicle.rows.length > 0) {
        res.status(409).json({ error: 'Ya existe otro vehículo con esta matrícula' });
        return;
      }
    }

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (licensePlate !== undefined) {
      updates.push(`license_plate = $${paramCounter++}`);
      values.push(licensePlate);
    }

    if (name !== undefined) {
      updates.push(`name = $${paramCounter++}`);
      values.push(name);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
      return;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, companyId);

    const result = await pool.query(
      `UPDATE vehicles SET ${updates.join(', ')} WHERE id = $${paramCounter++} AND company_id = $${paramCounter++} RETURNING *`,
      values
    );

    const vehicle = result.rows[0];
    res.json({
      message: 'Vehículo actualizado exitosamente',
      vehicle: {
        id: vehicle.id,
        licensePlate: vehicle.license_plate,
        name: vehicle.name,
        companyId: vehicle.company_id,
        createdAt: vehicle.created_at,
        updatedAt: vehicle.updated_at,
        isActive: vehicle.is_active
      }
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const result = await pool.query(
      'UPDATE vehicles SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND company_id = $2 AND is_active = true RETURNING *',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Vehículo no encontrado' });
      return;
    }

    res.json({ message: 'Vehículo eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};