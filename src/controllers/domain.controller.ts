import { Request, Response, NextFunction } from 'express';
import { domainService } from '../services/domain.service';
import Joi from 'joi';
import { validate } from '../middleware/validation';
import { DnsRecordType } from 'it-assets-management-models';

/**
 * @swagger
 * tags:
 *   name: Domains
 *   description: 域名管理API
 */

// 域名验证模式
const domainSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  description: Joi.string().optional().max(500),
  targetAddress: Joi.string().required().max(255),
  recordType: Joi.string().valid(...Object.values(DnsRecordType)).required(),
  ttl: Joi.number().optional().min(0),
  priority: Joi.number().optional().min(0).max(65535),
  admin: Joi.string().required(),
  enabled: Joi.boolean().optional().default(true),
  tags: Joi.array().items(Joi.string()).optional(),
  metadata: Joi.object().optional(),
});

const domainUpdateSchema = Joi.object({
  name: Joi.string().optional().min(1).max(255),
  description: Joi.string().optional().max(500),
  targetAddress: Joi.string().optional().max(255),
  recordType: Joi.string().optional().valid(...Object.values(DnsRecordType)),
  ttl: Joi.number().optional().min(0),
  priority: Joi.number().optional().min(0).max(65535),
  admin: Joi.string().optional().email(),
  enabled: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  metadata: Joi.object().optional(),
});

const domainIdSchema = Joi.object({
  id: Joi.string().required(),
});

// 域名控制器类
export class DomainController {
  /**
   * @swagger
   * /api/v1/domains:
   *   post:
   *     summary: 创建域名
   *     tags: [Domains]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/DomainRequest'
   *     responses:
   *       201:
   *         description: 域名创建成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/Domain'
   *       400:
   *         description: 请求参数错误
   *       500:
   *         description: 服务器错误
   */
  public createDomain = [
    validate({ body: domainSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const domain = await domainService.createDomain(req.body);
        res.status(201).json({
          status: 201,
          message: 'Domain created successfully',
          data: domain,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * @swagger
   * /api/v1/domains:
   *   get:
   *     summary: 获取所有域名
   *     tags: [Domains]
   *     responses:
   *       200:
   *         description: 成功获取所有域名
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Domain'
   *                 count:
   *                   type: number
   *       500:
   *         description: 服务器错误
   */
  public getAllDomains = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const domains = await domainService.getAllDomains();
      res.status(200).json({
        status: 200,
        message: 'Domains retrieved successfully',
        data: domains,
        count: domains.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/v1/domains/{id}:
   *   get:
   *     summary: 根据ID获取域名
   *     tags: [Domains]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: 域名ID
   *     responses:
   *       200:
   *         description: 成功获取域名
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/Domain'
   *       404:
   *         description: 域名不存在
   *       500:
   *         description: 服务器错误
   */
  public getDomainById = [
    validate({ params: domainIdSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const domain = await domainService.getDomainById(req.params.id);
        if (!domain) {
          return res.status(404).json({
            status: 404,
            message: 'Domain not found',
          });
        }
        res.status(200).json({
          status: 200,
          message: 'Domain retrieved successfully',
          data: domain,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * @swagger
   * /api/v1/domains/{id}:
   *   put:
   *     summary: 更新域名
   *     tags: [Domains]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: 域名ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/DomainUpdateRequest'
   *     responses:
   *       200:
   *         description: 域名更新成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/Domain'
   *       400:
   *         description: 请求参数错误
   *       404:
   *         description: 域名不存在
   *       500:
   *         description: 服务器错误
   */
  public updateDomain = [
    validate({ params: domainIdSchema, body: domainUpdateSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const domain = await domainService.updateDomain(req.params.id, req.body);
        res.status(200).json({
          status: 200,
          message: 'Domain updated successfully',
          data: domain,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * @swagger
   * /api/v1/domains/{id}:
   *   delete:
   *     summary: 删除域名
   *     tags: [Domains]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: 域名ID
   *     responses:
   *       200:
   *         description: 域名删除成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *       404:
   *         description: 域名不存在
   *       500:
   *         description: 服务器错误
   */
  public deleteDomain = [
    validate({ params: domainIdSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await domainService.deleteDomain(req.params.id);
        res.status(200).json({
          status: 200,
          message: 'Domain deleted successfully',
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * @swagger
   * /api/v1/domains/{id}/status:
   *   patch:
   *     summary: 更新域名状态
   *     tags: [Domains]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: 域名ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               enabled:
   *                 type: boolean
   *                 description: 是否启用域名
   *     responses:
   *       200:
   *         description: 域名状态更新成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/Domain'
   *       400:
   *         description: 请求参数错误
   *       404:
   *         description: 域名不存在
   *       500:
   *         description: 服务器错误
   */
  public updateDomainStatus = [
    validate({
      params: domainIdSchema,
      body: Joi.object({
        enabled: Joi.boolean().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const domain = await domainService.updateDomainStatus(req.params.id, req.body.enabled);
        res.status(200).json({
          status: 200,
          message: 'Domain status updated successfully',
          data: domain,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * @swagger
   * /api/v1/domains/type/{recordType}:
   *   get:
   *     summary: 根据记录类型获取域名
   *     tags: [Domains]
   *     parameters:
   *       - in: path
   *         name: recordType
   *         required: true
   *         schema:
   *           type: string
   *         description: DNS记录类型
   *     responses:
   *       200:
   *         description: 成功获取域名列表
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Domain'
   *                 count:
   *                   type: number
   *       500:
   *         description: 服务器错误
   */
  public getDomainsByType = [
    validate({ params: Joi.object({ recordType: Joi.string().required() }) }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const domains = await domainService.getDomainsByType(req.params.recordType);
        res.status(200).json({
          status: 200,
          message: 'Domains retrieved by type successfully',
          data: domains,
          count: domains.length,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * @swagger
   * /api/v1/domains/status/{status}:
   *   get:
   *     summary: 根据状态获取域名
   *     tags: [Domains]
   *     parameters:
   *       - in: path
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [enabled, disabled]
   *         description: 域名状态
   *     responses:
   *       200:
   *         description: 成功获取域名列表
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Domain'
   *                 count:
   *                   type: number
   *       500:
   *         description: 服务器错误
   */
  public getDomainsByStatus = [
    validate({ params: Joi.object({ status: Joi.string().required() }) }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const status = req.params.status === 'enabled' ? true : false;
        const domains = await domainService.getDomainsByStatus(status);
        res.status(200).json({
          status: 200,
          message: 'Domains retrieved by status successfully',
          data: domains,
          count: domains.length,
        });
      } catch (error) {
        next(error);
      }
    },
  ];
}

// 创建控制器实例
export const domainController = new DomainController();