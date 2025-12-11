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
};