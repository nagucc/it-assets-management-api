import { createLogger, format, transports } from 'winston';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

const { combine, timestamp, printf, colorize } = format;

// 日志格式
const logFormat = combine(
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  })
);

// 创建日志记录器
export const logger = createLogger({
  level: config.logger.level,
  format: logFormat,
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/combined.log',
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: 'logs/exceptions.log',
    }),
  ],
});

// 确保日志目录存在
import fs from 'fs';
import path from 'path';

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 日志中间件
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    logger.info(`${method} ${url} ${statusCode} ${duration}ms - ${ip}`);
  });
  
  next();
};