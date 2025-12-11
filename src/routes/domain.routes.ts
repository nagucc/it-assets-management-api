import { Router } from 'express';
import { domainController } from '../controllers/domain.controller';

const router = Router();

// 域名管理路由
router.post('/domains', domainController.createDomain);
router.get('/domains', domainController.getAllDomains);
router.get('/domains/:id', domainController.getDomainById);
router.put('/domains/:id', domainController.updateDomain);
router.delete('/domains/:id', domainController.deleteDomain);
router.patch('/domains/:id/status', domainController.updateDomainStatus);
router.get('/domains/type/:recordType', domainController.getDomainsByType);
router.get('/domains/status/:status', domainController.getDomainsByStatus);

export default router;