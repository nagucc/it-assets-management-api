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
| JWT_SECRET | JWT认证密钥 | your-secret-key-change-in-production |
| ROLE_USER | 普通用户角色标识 | 普通用户 |
| ROLE_ADMIN | 系统管理员角色标识 | 系统管理员 |

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

## JWT认证

### 配置方式

JWT认证密钥通过环境变量`JWT_SECRET`进行配置，配置文件位于：

- **配置源文件**：`src/config/index.ts` - 定义了JWT密钥的默认值
- **环境变量示例**：`.env.example` - 提供了JWT_SECRET的配置示例

### 认证使用说明

1. **获取JWT令牌**：目前系统不提供令牌生成接口，测试环境可使用测试脚本生成
2. **使用令牌**：在请求头中添加`Authorization: Bearer <your-token>`
3. **令牌验证**：系统会自动验证令牌有效性，验证失败将返回401状态码
4. **用户信息**：验证成功后，令牌中的用户信息会被添加到请求对象中

### 令牌结构

JWT令牌包含以下信息：
- `username`：用户名
- `role`：用户角色，可通过环境变量配置，默认支持`普通用户`和`系统管理员`
- `exp`：过期时间戳

### 测试令牌生成

项目提供了多种方式来获取测试JWT令牌，以下是详细的步骤说明：

#### 前置条件

1. 已安装Node.js 16.x或更高版本
2. 已安装npm或yarn包管理器
3. 已克隆项目代码
4. 已安装项目依赖（`npm install`）
5. 已构建项目（`npm run build`）

#### 方式一：使用项目自带的测试脚本生成

项目根目录提供了多个JWT测试脚本，您可以直接运行这些脚本来生成测试JWT令牌：

1. **生成并验证测试JWT**：
   ```bash
   node test-jwt.js
   ```

2. **查看测试JWT服务功能**：
   ```bash
   node test-jwt-service.js
   ```

#### 方式二：手动生成JWT令牌

如果您需要自定义JWT的内容，可以手动编写脚本生成：

1. 创建一个临时脚本文件（如`generate-jwt.js`）：
   ```javascript
   const jwt = require('jsonwebtoken');
   const { config } = require('./dist/config');

   // 自定义JWT内容
   const payload = {
     username: 'testuser',          // 用户名（必填）
     role: '系统管理员',             // 用户角色：'普通用户' 或 '系统管理员'（必填）
     exp: Math.floor(Date.now() / 1000) + 3600, // 过期时间（必填，1小时后过期）
   };

   const token = jwt.sign(payload, config.jwt.secret);
   console.log('生成的测试JWT令牌:', token);
   ```

2. 运行脚本生成令牌：
   ```bash
   node generate-jwt.js
   ```

#### 方式三：直接使用JWT库生成

在其他环境中，您可以使用任何JWT库生成令牌，只要满足以下条件：

- 使用与项目相同的JWT密钥（默认：`your-secret-key-change-in-production`，可在`.env`文件中配置）
- 令牌包含必要的payload字段：`username`、`role`和`exp`

#### 成功获取后的JWT格式示例

生成的JWT令牌格式如下（示例）：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwicm9sZSI6Iui/mea4heS4iOW8oeeQhuWRmCIsImV4cCI6MTc2NTc3MTQzNiwiaWF0IjoxNzY1NzY3ODM2fQ.7a2c3c5e7b9d1f3a5c7e9b1d3f5a7c9e
```

#### 如何在测试中使用JWT进行身份验证

获取JWT令牌后，您可以在API请求中使用该令牌进行身份验证：

1. **在HTTP请求头中添加JWT**：
   ```
   Authorization: Bearer <your-token>
   ```

2. **使用curl命令测试**：
   ```bash
   curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." http://localhost:3000/api/v1/domains
   ```

3. **在Postman中使用**：
   - 打开Postman
   - 创建一个新的请求
   - 在"Headers"选项卡中添加：
     - Key: `Authorization`
     - Value: `Bearer <your-token>`
   - 发送请求

4. **在集成测试中使用**：
   项目的集成测试文件位于`src/__tests__/integration.test.ts`，您可以参考其中的测试用例，使用`test-helpers.ts`中提供的工具函数生成和使用测试JWT。

#### JWT令牌验证规则

- JWT令牌必须包含三段式结构（使用`.`分隔）
- 必须包含`exp`（过期时间）字段，否则令牌将被拒绝
- 必须包含`username`和`role`字段
- 令牌签名必须与配置的`JWT_SECRET`匹配
- 令牌未过期

#### 常见问题排查

1. **令牌验证失败（401错误）**：
   - 检查令牌格式是否正确
   - 检查令牌是否已过期
   - 检查令牌中的`exp`字段是否存在
   - 检查令牌签名是否与配置的`JWT_SECRET`匹配

2. **无法生成令牌**：
   - 确保项目已成功构建（`npm run build`）
   - 确保配置文件已正确加载
   - 检查`JWT_SECRET`环境变量是否已配置

3. **脚本运行错误**：
   - 确保已安装所有依赖（`npm install`）
   - 确保Node.js版本符合要求
   - 检查脚本路径是否正确

### 安全建议

- 在生产环境中，务必更改默认的`JWT_SECRET`为强随机值
- 建议定期轮换JWT密钥
- 令牌应设置合理的过期时间
- 考虑使用HTTPS协议传输令牌

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