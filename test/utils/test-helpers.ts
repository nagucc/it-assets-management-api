import jwt from 'jsonwebtoken';
import { config } from '../../src/config';
import { UserRole } from '../../src/services/jwt.service';

/**
 * 生成测试用的JWT令牌
 */
export const generateTestToken = (username: string = 'testuser', role: UserRole = '系统管理员'): string => {
  const payload = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1小时过期
  };

  return jwt.sign(payload, config.jwt.secret);
};
