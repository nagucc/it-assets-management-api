import { Request, Response, NextFunction } from 'express';
import { jwtService, UserRole } from '../services/jwt.service';

declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        role: UserRole;
      };
    }
  }
}

/**
 * JWT认证中间件
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 从请求头中获取Authorization字段
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_MISSING_TOKEN',
        type: 'missing_token',
        message: '未提供有效的认证令牌',
        suggestion: '请在请求头中添加有效的Bearer令牌'
      }
    });
  }
  
  // 提取JWT令牌
  const token = authHeader.split(' ')[1];
  
  // 验证令牌
  const validationResult = jwtService.verifyToken(token);
  
  if (!validationResult.valid) {
    const error = validationResult.error!;
    let suggestion = '请检查您的认证令牌是否有效';
    let code = 'AUTH_INVALID_TOKEN';
    
    // 根据不同的错误类型设置详细的建议
    switch (error.type) {
      case 'expired':
        code = 'AUTH_TOKEN_EXPIRED';
        suggestion = 'Token已过期，请重新登录获取新的认证令牌';
        break;
      case 'invalid_signature':
        code = 'AUTH_INVALID_SIGNATURE';
        suggestion = 'Token签名验证失败，可能已被篡改或使用了错误的密钥，请重新获取有效令牌';
        break;
      case 'invalid_format':
        code = 'AUTH_INVALID_FORMAT';
        suggestion = 'Token格式错误，请确保使用符合JWT标准的三段式结构和正确的Base64编码';
        break;
      case 'invalid_claims':
        code = 'AUTH_INVALID_CLAIMS';
        suggestion = 'Token包含无效的声明，请重新获取有效令牌';
        break;
      case 'revoked':
        code = 'AUTH_TOKEN_REVOKED';
        suggestion = 'Token已被撤销，请重新登录获取新的认证令牌';
        break;
      case 'unknown':
        code = 'AUTH_UNKNOWN_ERROR';
        suggestion = 'Token验证过程中发生未知错误，请稍后重试或联系管理员';
        break;
    }
    
    return res.status(401).json({
      success: false,
      error: {
        code,
        type: error.type,
        message: error.message,
        suggestion
      }
    });
  }
  
  // 将用户信息添加到请求对象中
  req.user = {
    username: validationResult.payload!.username,
    role: validationResult.payload!.role,
  };
  
  next();
};

/**
 * 角色授权中间件
 */
export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '用户未认证',
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '用户没有权限执行此操作',
      });
    }
    
    next();
  };
};
