export interface Config {
  server: {
    port: number;
    host: string;
    env: string;
  };
  storage: {
    type: 'filesystem' | 'memory';
    path: string;
  };
  logger: {
    level: string;
    format: string;
  };
  jwt: {
    secret: string;
  };
  roles: {
    user: string;
    admin: string;
  };
}

export const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'development',
  },
  storage: {
    type: 'filesystem',
    path: process.env.STORAGE_PATH || './data',
  },
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  },
  roles: {
    user: process.env.ROLE_USER || '普通用户',
    admin: process.env.ROLE_ADMIN || '系统管理员',
  },
};

/**
 * 验证角色标识配置是否符合要求
 * @returns {boolean} 配置是否有效
 * @throws {Error} 配置无效时抛出错误
 */
export const validateRolesConfig = (): boolean => {
  const { roles } = config;
  
  // 检查角色标识是否为空
  if (!roles.user || !roles.admin) {
    throw new Error('角色标识配置无效：普通用户和系统管理员角色标识不能为空');
  }
  
  // 检查角色标识是否相同
  if (roles.user === roles.admin) {
    throw new Error('角色标识配置无效：普通用户和系统管理员角色标识不能相同');
  }
  
  // 检查角色标识是否只包含有效字符（字母、数字、中文、下划线、连字符）
  const rolePattern = /^[\w\u4e00-\u9fa5-]+$/;
  if (!rolePattern.test(roles.user) || !rolePattern.test(roles.admin)) {
    throw new Error('角色标识配置无效：角色标识只能包含字母、数字、中文、下划线和连字符');
  }
  
  return true;
};

// 应用启动时验证配置
try {
  validateRolesConfig();
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('配置验证失败：', errorMessage);
  process.exit(1);
}