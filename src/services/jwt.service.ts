import jwt from 'jsonwebtoken';
import { config } from '../config';

export type UserRole = string;

export interface JwtPayload {
  username: string;
  role: UserRole;
  exp?: number;
}

export interface JwtValidationResult {
  valid: boolean;
  payload?: JwtPayload;
  error?: {
    type: 'expired' | 'invalid_signature' | 'invalid_format' | 'invalid_claims' | 'revoked' | 'unknown';
    message: string;
  };
}

export class JwtService {
  private secretKey: string;

  constructor() {
    this.secretKey = config.jwt.secret;
  }

  /**
   * 验证JWT令牌
   * 规则：当解析JWT后发现其payload中不包含过期时间字段(exp)时，判定该token已过期并拒绝访问请求
   */
  verifyToken(token: string): JwtValidationResult {
    try {
      // 首先检查token格式是否符合JWT标准（三段式结构）
      if (!token || token.split('.').length !== 3) {
        return {
          valid: false,
          error: {
            type: 'invalid_format',
            message: 'Token格式错误，不符合JWT标准（三段式结构）'
          }
        };
      }
      
      // 首先验证令牌的基本有效性
      const decoded = jwt.verify(token, this.secretKey) as JwtPayload;
      
      // 检查payload中是否包含exp字段
      if (decoded.exp === undefined) {
        // 如果没有exp字段，则判定令牌已过期/无效
        return {
          valid: false,
          error: {
            type: 'invalid_claims',
            message: 'Token缺少过期时间声明(exp)'
          }
        };
      }
      
      // 检查payload中是否包含必要的声明
      if (!decoded.username || !decoded.role) {
        return {
          valid: false,
          error: {
            type: 'invalid_claims',
            message: 'Token缺少必要的声明字段（username或role）'
          }
        };
      }
      
      return {
        valid: true,
        payload: decoded
      };
    } catch (error) {
      // 捕获并区分不同类型的JWT验证错误
      if (error instanceof jwt.TokenExpiredError) {
        return {
          valid: false,
          error: {
            type: 'expired',
            message: 'Token已过期'
          }
        };
      } else if (error instanceof jwt.JsonWebTokenError) {
        if (error.message === 'invalid signature') {
          return {
            valid: false,
            error: {
              type: 'invalid_signature',
              message: 'Token签名验证失败'
            }
          };
        } else {
          return {
            valid: false,
            error: {
              type: 'invalid_format',
              message: `Token格式错误：${error.message}`
            }
          };
        }
      } else if (error instanceof jwt.NotBeforeError) {
        return {
          valid: false,
          error: {
            type: 'invalid_claims',
            message: 'Token尚未生效'
          }
        };
      } else {
        return {
          valid: false,
          error: {
            type: 'unknown',
            message: 'Token验证失败，未知错误'
          }
        };
      }
    }
  }
}

export const jwtService = new JwtService();
