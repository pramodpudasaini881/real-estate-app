import { Response } from 'express';
import { getListings, getListingById } from '../services/listingService';
import { AuthenticatedRequest } from '../middleware/auth';

// Helper to remove sensitive data for non-admins
const sanitizeProperty = (property: any, role: string) => {
  if (role !== 'admin') {
    const { statusNote, ...rest } = property;
    return rest;
  }
  return property;
};

export const getPropertiesCtrl = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = req.query;
    const result = await getListings(filters);
    const role = req.userRole || 'user';

    // Sanitize results based on role
    const sanitizedData = result.data.map(prop => sanitizeProperty(prop, role));

    res.json({
      ...result,
      data: sanitizedData
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPropertyByIdCtrl = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID format' });
      return;
    }

    const property = await getListingById(id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    const role = req.userRole || 'user';
    res.json({ data: sanitizeProperty(property, role) });
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
