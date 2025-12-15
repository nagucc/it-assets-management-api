import { Request, Response, NextFunction } from 'express';
import { domainService } from '../services/domain.service';
import { UserRole } from '../services/jwt.service';
import { config } from '../config';

/**
 * 权限验证中间件
 * 实现规则：
 * 1. 系统管理员：允许对所有域名执行完整的CRUD操作
 * 2. 普通用户：仅允许对自己是管理员的域名执行完整的CRUD操作
 */
export const permissionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_MISSING_USER',
          type: 'missing_user',
          message: '用户信息缺失，请重新登录',
          suggestion: '请在请求头中添加有效的Bearer令牌'
        }
      });
    }

    // 系统管理员拥有所有权限，直接放行
    if (user.role === config.roles.admin) {
      return next();
    }

    // 普通用户权限验证
    if (user.role === config.roles.user) {
      // 获取目标域名ID
      let domainId: string | undefined;
      
      // 从请求参数或URL中获取域名ID
      if (req.params.id) {
        domainId = req.params.id;
      } else if (req.body && req.body.id) {
        domainId = req.body.id;
      }

      // 如果是创建域名操作，需要验证创建者是否为自己
      if (req.method === 'POST' && !domainId) {
        // 对于创建操作，确保普通用户只能创建自己为管理员的域名
        const admin = req.body.admin;
        if (admin && admin !== user.username) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'PERMISSION_DENIED',
              type: 'permission_denied',
              message: '权限不足，普通用户只能创建自己为管理员的域名',
              suggestion: '请确保域名管理员字段设置为当前登录用户名'
            }
          });
        }
        return next();
      }

      // 如果是其他操作（GET、PUT、DELETE等），需要验证域名存在且用户是管理员
      if (domainId) {
        const domain = await domainService.getDomainById(domainId);
        if (!domain) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'DOMAIN_NOT_FOUND',
              type: 'not_found',
              message: '域名不存在',
              suggestion: '请检查域名ID是否正确'
            }
          });
        }

        // 验证用户是否为该域名的管理员
        if (domain.admin !== user.username) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'PERMISSION_DENIED',
              type: 'permission_denied',
              message: '权限不足，普通用户只能操作自己是管理员的域名',
              suggestion: '请联系域名管理员获取权限'
            }
          });
        }
      }

      // 对于批量获取操作（如GET /api/v1/domains），需要在控制器中过滤
      if (req.method === 'GET' && !domainId) {
        // 标记请求需要过滤域名列表
        (req as any).filterByAdmin = true;
      }
      
      return next();
    }
    
    // 角色不匹配，拒绝访问
    return res.status(403).json({
      success: false,
      error: {
        code: 'PERMISSION_DENIED',
        type: 'permission_denied',
        message: '权限不足，您的角色不允许访问该资源',
        suggestion: '请联系系统管理员获取适当的权限'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 过滤普通用户可访问的域名列表
 * @param domains 所有域名列表
 * @param username 当前登录用户名
 * @returns 过滤后的域名列表
 */
export const filterDomainsByAdmin = (domains: any[], username: string) => {
  return domains.filter(domain => domain.admin === username);
};
