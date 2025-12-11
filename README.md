# IT资产管理API系统

## 项目简介

IT资产管理API系统是一个用TypeScript构建的RESTful API服务，主要用于管理IT资源，特别是域名资源。该系统提供了完整的域名管理功能，包括创建、查询、更新、删除和状态管理等。

## 技术栈

- **开发语言**：TypeScript
- **Web框架**：Express.js
- **文档工具**：Swagger
- **日志系统**：Winston
- **数据验证**：Joi
- **测试框架**：Jest
- **容器化**：Docker

## 功能特性

### 域名管理
- 创建新域名记录
- 获取所有域名列表
- 根据ID查询特定域名
- 更新域名信息
- 删除域名记录
- 启用/禁用域名状态
- 按记录类型过滤域名
- 按状态过滤域名

### 系统特性
- RESTful API设计
- Swagger文档自动生成
- 统一的错误处理
- 结构化日志记录
- 请求验证中间件
- 环境配置支持
- 优雅关闭机制
- 健康检查端点

## 快速开始

### 前提条件

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器
- Git

### 安装步骤

1. **克隆代码仓库**

```bash
git clone https://github.com/nagucc/it-assets-management-api.git
cd it-assets-management-api
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

```bash
cp .env.example .env
# 根据需要编辑.env文件
```

4. **启动开发服务器**

```bash
npm run dev
```

服务器将在 `http://0.0.0.0:3000` 上运行。

### 使用Docker启动

```bash
docker build -t it-assets-management-api .
docker run -p 3000:3000 it-assets-management-api
```

## API文档

启动服务后，可以通过以下地址访问自动生成的Swagger文档：

```
http://localhost:3000/api-docs
```

## API端点

### 域名管理API

#### 创建域名
- **方法**：POST
- **端点**：`/api/v1/domains`
- **请求体**：域名详细信息
- **响应**：创建的域名对象

#### 获取所有域名
- **方法**：GET
- **端点**：`/api/v1/domains`
- **响应**：域名列表

#### 获取特定域名
- **方法**：GET
- **端点**：`/api/v1/domains/:id`
- **响应**：域名对象

#### 更新域名
- **方法**：PUT
- **端点**：`/api/v1/domains/:id`
- **请求体**：要更新的域名信息
- **响应**：更新后的域名对象

#### 删除域名
- **方法**：DELETE
- **端点**：`/api/v1/domains/:id`
- **响应**：删除成功消息

#### 更新域名状态
- **方法**：PATCH
- **端点**：`/api/v1/domains/:id/status`
- **请求体**：`{"enabled": true/false}`
- **响应**：更新后的域名对象

#### 按记录类型查询域名
- **方法**：GET
- **端点**：`/api/v1/domains/type/:recordType`
- **响应**：匹配的域名列表

#### 按状态查询域名
- **方法**：GET
- **端点**：`/api/v1/domains/status/:status`
- **响应**：匹配的域名列表

### 健康检查

- **方法**：GET
- **端点**：`/health`
- **响应**：系统状态信息

## 环境变量

系统支持以下环境变量配置：

| 环境变量 | 说明 | 默认值 |
|---------|------|-------|
| PORT | 服务器端口 | 3000 |
| HOST | 服务器主机 | 0.0.0.0 |
| NODE_ENV | 运行环境 | development |
| STORAGE_PATH | 存储路径 | ./data |
| LOG_LEVEL | 日志级别 | info |
| LOG_FORMAT | 日志格式 | combined |

## 项目结构

```
it-assets-management-api/
├── .env.example          # 环境变量示例文件
├── .github/workflows/    # GitHub Actions工作流
├── .gitignore            # Git忽略文件
├── Dockerfile            # Docker构建文件
├── LICENSE               # 许可证文件
├── README.md             # 项目说明文档
├── jest.config.js        # Jest配置文件
├── package-lock.json     # npm依赖锁定文件
├── package.json          # 项目配置和依赖
├── tsconfig.json         # TypeScript配置
├── src/                  # 源代码目录
│   ├── __tests__/        # 测试文件
│   ├── app.ts            # 应用程序入口
│   ├── config/           # 配置文件
│   ├── controllers/      # API控制器
│   ├── middleware/       # 中间件
│   ├── models/           # 数据模型
│   ├── routes/           # 路由定义
│   ├── services/         # 业务服务
│   └── utils/            # 工具函数
```

## 开发指南

### 构建项目

```bash
npm run build
```

构建后的文件将位于 `dist` 目录。

### 运行测试

```bash
npm test
```

### 启动生产服务

```bash
npm start
```

## 部署

### Docker部署

1. **构建Docker镜像**

```bash
docker build -t it-assets-management-api .
```

2. **运行Docker容器**

```bash
docker run -d -p 3000:3000 --name it-assets-api it-assets-management-api
```

### 持续集成/持续部署

项目配置了GitHub Actions工作流，可以自动构建Docker镜像并推送到镜像仓库。详细配置见 `.github/workflows/docker-build-push.yml`。

## 错误处理

API使用统一的错误响应格式：

```json
{
  "status": 400,
  "message": "错误描述信息",
  "error": "错误类型"
}
```

常见的错误状态码：
- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误

## 日志系统

系统日志配置位于 `middleware/logger.ts`，支持以下日志级别：
- error
- warn
- info
- verbose
- debug
- silly

日志文件保存在 `logs` 目录下：
- combined.log: 所有日志
- error.log: 错误日志
- exceptions.log: 异常日志

## 安全注意事项

- 生产环境中应配置适当的认证和授权机制
- 建议使用HTTPS协议
- 定期更新依赖包以修复已知漏洞
- 配置适当的CORS策略
- 实施请求限流以防止DDoS攻击

## 未来规划

- 添加用户认证和授权
- 支持更多IT资源类型管理（如服务器、软件许可证等）
- 实现数据导入/导出功能
- 添加数据统计和报表功能
- 集成监控和告警系统

## 许可证

本项目采用ISC许可证。详见 [LICENSE](LICENSE) 文件。

## 贡献指南

欢迎提交问题报告和功能请求！如果您想参与代码开发，请遵循以下步骤：

1. Fork本仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 联系方式

如有问题或建议，请在GitHub仓库提交Issue或联系项目维护者。

---

*最后更新时间：2024年*