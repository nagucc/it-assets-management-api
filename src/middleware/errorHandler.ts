import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // 记录错误日志
  logger.error('API Error Occurred', {
    requestId: (req as any).requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    statusCode: status,
    error: {
      name: err.name || 'Error',
      message: message,
      stack: err.stack || 'No stack trace available',
      code: err.code,
      details: err.details
    },
    headers: req.headers,
    query: req.query,
    params: req.params,
    // 仅在非生产环境记录请求体
    body: process.env.NODE_ENV !== 'production' ? req.body : undefined
  });
  
  // 构建错误响应
  const errorResponse: ErrorResponse = {
    status,
    message,
  };
  
  // 在开发环境下返回完整错误栈
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(status).json(errorResponse);
};

// 处理404错误
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  (error as any).status = 404;
  next(error);
};