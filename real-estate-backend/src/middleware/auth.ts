import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  userRole?: string;
}

export const mockAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const role = req.headers['x-user-role'];
  if (typeof role === 'string') {
    req.userRole = role;
  } else {
    req.userRole = 'user'; // Default role
  }
  next();
};
