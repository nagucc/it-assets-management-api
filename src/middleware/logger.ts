import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, json, printf, colorize, metadata } = format;

// 确保日志目录存在
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 日志格式
const logFormat = combine(
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  metadata({
    fillExcept: ['message', 'level', 'timestamp', 'label']
  }),
  json()
);

const consoleFormat = combine(
  colorize(),
  timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  printf(({ timestamp, level, message, metadata }) => {
    const metaObj = metadata as Record<string, any>;
    const meta = Object.keys(metaObj).length > 0 ? ` ${JSON.stringify(metaObj)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${meta}`;
  })
);

// 创建日志记录器
export const logger = createLogger({
  level: config.logger.level,
  format: logFormat,
  transports: [
    // 控制台输出
    new transports.Console({
      format: consoleFormat,
    }),
    
    // 按日期轮转的错误日志
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      handleExceptions: true,
      json: true,
      format: logFormat
    }),
    
    // 按日期轮转的访问日志
    new DailyRotateFile({
      filename: path.join(logsDir, 'access-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '30d',
      json: true,
      format: logFormat
    }),
    
    // 按日期轮转的综合日志
    new DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '30d',
      handleExceptions: true,
      json: true,
      format: logFormat
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '14d',
      json: true,
      format: logFormat
    })
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '14d',
      json: true,
      format: logFormat
    })
  ],
  // 禁用未处理异常导致进程退出
  exitOnError: false
});

// 生成唯一请求ID
const generateRequestId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 日志中间件
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // 将请求ID添加到请求对象
  (req as any).requestId = requestId;
  
  // 提取请求信息
  const { method, url, ip, headers, body, query, params } = req;
  
  // 记录请求开始
  logger.info('API Request Started', {
    requestId,
    method,
    url,
    ip,
    userAgent: headers['user-agent'],
    contentType: headers['content-type'],
    accept: headers['accept'],
    query,
    params,
    // 仅在非生产环境记录请求体
    body: config.server.env !== 'production' ? body : undefined
  });
  
  // 监听响应完成事件
  res.on('finish', () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // 记录请求完成
    logger.info('API Request Completed', {
      requestId,
      method,
      url,
      ip,
      statusCode: res.statusCode,
      responseTime: duration,
      contentLength: res.get('content-length')
    });
  });
  
  // 监听响应错误事件
  res.on('error', (error) => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    logger.error('API Response Error', {
      requestId,
      method,
      url,
      ip,
      statusCode: res.statusCode,
      responseTime: duration,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  });
  
  next();
};