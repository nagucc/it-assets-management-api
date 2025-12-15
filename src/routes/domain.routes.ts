import { Router } from 'express';
import { domainController } from '../controllers/domain.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { permissionMiddleware } from '../middleware/permission.middleware';

const router = Router();

// 域名管理路由
// 所有路由都需要权限验证
router.get('/domains', authMiddleware, permissionMiddleware, domainController.getAllDomains);
router.get('/domains/:id', authMiddleware, permissionMiddleware, domainController.getDomainById);
router.get('/domains/type/:recordType', authMiddleware, permissionMiddleware, domainController.getDomainsByType);
router.get('/domains/status/:status', authMiddleware, permissionMiddleware, domainController.getDomainsByStatus);
router.post('/domains', authMiddleware, permissionMiddleware, domainController.createDomain);
router.put('/domains/:id', authMiddleware, permissionMiddleware, domainController.updateDomain);
router.delete('/domains/:id', authMiddleware, permissionMiddleware, domainController.deleteDomain);
router.patch('/domains/:id/status', authMiddleware, permissionMiddleware, domainController.updateDomainStatus);

export default router;