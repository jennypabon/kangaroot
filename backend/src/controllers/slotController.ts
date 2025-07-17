import { Request, Response } from 'express';
import pool from '../config/database';
import { Slot, SlotRegistrationData, SlotUpdateData } from '../models/Slot';

interface AuthenticatedRequest extends Request {
  company?: any;
}

export const createSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, height, width, depth, isActive, vehicleId } = req.body as SlotRegistrationData;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    if (!name || !height || !width || !depth || vehicleId === undefined) {
      res.status(400).json({ error: 'Todos los campos son requeridos' });
      return;
    }

    if (height <= 0 || width <= 0 || depth <= 0) {
      res.status(400).json({ error: 'Las dimensiones deben ser mayores a 0' });
      return;
    }

    // Check if vehicle exists and belongs to company
    const vehicleCheck = await pool.query(
      'SELECT id FROM vehicles WHERE id = $1 AND company_id = $2 AND is_active = true',
      [vehicleId, companyId]
    );

    if (vehicleCheck.rows.length === 0) {
      res.status(404).json({ error: 'Vehículo no encontrado' });
      return;
    }

    // Check if slot name already exists for this vehicle
    const existingSlot = await pool.query(
      'SELECT id FROM slots WHERE name = $1 AND vehicle_id = $2',
      [name, vehicleId]
    );

    if (existingSlot.rows.length > 0) {
      res.status(409).json({ error: 'Ya existe una plaza con este nombre en el vehículo' });
      return;
    }

    const result = await pool.query(
      'INSERT INTO slots (name, height, width, depth, is_active, vehicle_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, height, width, depth, isActive, vehicleId]
    );

    const slot = result.rows[0];
    res.status(201).json({
      message: 'Plaza creada exitosamente',
      slot: {
        id: slot.id,
        name: slot.name,
        height: parseFloat(slot.height),
        width: parseFloat(slot.width),
        depth: parseFloat(slot.depth),
        isActive: slot.is_active,
        vehicleId: slot.vehicle_id,
        createdAt: slot.created_at,
        updatedAt: slot.updated_at
      }
    });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getSlotsByVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId } = req.params;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    // Check if vehicle exists and belongs to company
    const vehicleCheck = await pool.query(
      'SELECT id FROM vehicles WHERE id = $1 AND company_id = $2 AND is_active = true',
      [vehicleId, companyId]
    );

    if (vehicleCheck.rows.length === 0) {
      res.status(404).json({ error: 'Vehículo no encontrado' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM slots WHERE vehicle_id = $1 ORDER BY created_at DESC',
      [vehicleId]
    );

    const slots = result.rows.map(slot => ({
      id: slot.id,
      name: slot.name,
      height: parseFloat(slot.height),
      width: parseFloat(slot.width),
      depth: parseFloat(slot.depth),
      isActive: slot.is_active,
      vehicleId: slot.vehicle_id,
      createdAt: slot.created_at,
      updatedAt: slot.updated_at
    }));

    res.json({ slots });
  } catch (error) {
    console.error('Error getting slots:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const result = await pool.query(
      `SELECT s.*, v.company_id 
       FROM slots s 
       JOIN vehicles v ON s.vehicle_id = v.id 
       WHERE s.id = $1 AND v.company_id = $2 AND v.is_active = true`,
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Plaza no encontrada' });
      return;
    }

    const slot = result.rows[0];
    res.json({
      slot: {
        id: slot.id,
        name: slot.name,
        height: parseFloat(slot.height),
        width: parseFloat(slot.width),
        depth: parseFloat(slot.depth),
        isActive: slot.is_active,
        vehicleId: slot.vehicle_id,
        createdAt: slot.created_at,
        updatedAt: slot.updated_at
      }
    });
  } catch (error) {
    console.error('Error getting slot:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, height, width, depth, isActive } = req.body as SlotUpdateData;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    // Check if slot exists and belongs to company
    const existingSlot = await pool.query(
      `SELECT s.*, v.company_id 
       FROM slots s 
       JOIN vehicles v ON s.vehicle_id = v.id 
       WHERE s.id = $1 AND v.company_id = $2 AND v.is_active = true`,
      [id, companyId]
    );

    if (existingSlot.rows.length === 0) {
      res.status(404).json({ error: 'Plaza no encontrada' });
      return;
    }

    const currentSlot = existingSlot.rows[0];

    // Check if name already exists for this vehicle (excluding current slot)
    if (name && name !== currentSlot.name) {
      const duplicateSlot = await pool.query(
        'SELECT id FROM slots WHERE name = $1 AND vehicle_id = $2 AND id != $3',
        [name, currentSlot.vehicle_id, id]
      );

      if (duplicateSlot.rows.length > 0) {
        res.status(409).json({ error: 'Ya existe otra plaza con este nombre en el vehículo' });
        return;
      }
    }

    // Validate dimensions if provided
    if (height !== undefined && height <= 0) {
      res.status(400).json({ error: 'La altura debe ser mayor a 0' });
      return;
    }
    if (width !== undefined && width <= 0) {
      res.status(400).json({ error: 'El ancho debe ser mayor a 0' });
      return;
    }
    if (depth !== undefined && depth <= 0) {
      res.status(400).json({ error: 'La profundidad debe ser mayor a 0' });
      return;
    }

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCounter++}`);
      values.push(name);
    }

    if (height !== undefined) {
      updates.push(`height = $${paramCounter++}`);
      values.push(height);
    }

    if (width !== undefined) {
      updates.push(`width = $${paramCounter++}`);
      values.push(width);
    }

    if (depth !== undefined) {
      updates.push(`depth = $${paramCounter++}`);
      values.push(depth);
    }

    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCounter++}`);
      values.push(isActive);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
      return;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE slots SET ${updates.join(', ')} WHERE id = $${paramCounter++} RETURNING *`,
      values
    );

    const slot = result.rows[0];
    res.json({
      message: 'Plaza actualizada exitosamente',
      slot: {
        id: slot.id,
        name: slot.name,
        height: parseFloat(slot.height),
        width: parseFloat(slot.width),
        depth: parseFloat(slot.depth),
        isActive: slot.is_active,
        vehicleId: slot.vehicle_id,
        createdAt: slot.created_at,
        updatedAt: slot.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating slot:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const companyId = (req as AuthenticatedRequest).company?.id;

    if (!companyId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const result = await pool.query(
      `DELETE FROM slots 
       WHERE id = $1 AND vehicle_id IN (
         SELECT id FROM vehicles WHERE company_id = $2 AND is_active = true
       ) 
       RETURNING *`,
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Plaza no encontrada' });
      return;
    }

    res.json({ message: 'Plaza eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};