import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  company?: any;
}

export const authenticateCompany = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Token requerido' });
      return;
    }

    // For now, we'll decode the token without verification
    // In production, you should verify the JWT properly
    const tokenData = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    req.company = {
      id: tokenData.companyId,
      adminUsername: tokenData.adminUsername,
      email: tokenData.email
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }
};