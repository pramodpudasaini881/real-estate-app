import { Router } from 'express';
import { getPropertiesCtrl, getPropertyByIdCtrl } from '../controllers/listings';
import { mockAuthMiddleware } from '../middleware/auth';

const router = Router();

router.use(mockAuthMiddleware);

router.get('/', getPropertiesCtrl);
router.get('/:id', getPropertyByIdCtrl);

export default router;
