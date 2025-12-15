import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { swaggerSpec } from './config/swagger';
import { loggerMiddleware, logger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { storageService } from './services/storage.service';
import domainRoutes from './routes/domain.routes';

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Swagger文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Swagger JSON规范
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'IT资源管理API系统运行正常',
    timestamp: new Date().toISOString(),
  });
});

// API路由
app.use('/api/v1', domainRoutes);

// 错误处理中间件
app.use(notFoundHandler);
app.use(errorHandler);

// 启动服务器
const PORT = config.server.port;
const HOST = config.server.host;

let server: any = null;

const startServer = async () => {
  try {
    // 初始化存储服务
    await storageService.initialize();
    
    // 启动服务器
    server = app.listen(PORT, HOST, () => {
      logger.info(`Server is running on http://${HOST}:${PORT}`);
      logger.info(`Swagger documentation available at http://${HOST}:${PORT}/api-docs`);
    });
    
    // 确保服务器对象正确创建
    if (!server) {
      throw new Error('Failed to create server instance');
    }
    
    // 监听服务器错误
    server.on('error', (error: Error) => {
      logger.error(`Server error: ${error.message}`);
      process.exit(1);
    });
    
    return server;
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  if (server) {
    server.close();
  }
  await storageService.release();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down server...');
  if (server) {
    server.close();
  }
  await storageService.release();
  process.exit(0);
});

// 监听未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 监听未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

// 仅在直接运行时启动服务器，测试环境下由测试框架控制
if (require.main === module) {
  startServer().catch((error) => {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
}

export { app, startServer };