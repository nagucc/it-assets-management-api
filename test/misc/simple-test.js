const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { config } = require('./dist/config');
const { loggerMiddleware, logger } = require('./dist/middleware/logger');
const { errorHandler, notFoundHandler } = require('./dist/middleware/errorHandler');
const { storageService } = require('./dist/services/storage.service');
const domainRoutes = require('./dist/routes/domain.routes');
const jwt = require('jsonwebtoken');

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

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

// 生成测试用的JWT令牌
const generateTestToken = (username = 'testuser', role = '系统管理员') => {
  const payload = {
    username,
    role,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1小时过期
  };

  return jwt.sign(payload, config.jwt.secret);
};

// 测试脚本
const runTests = async () => {
  console.log('开始测试API...');
  
  try {
    // 确保存储服务已初始化
    await storageService.initialize();
    
    // 生成测试令牌
    const testToken = generateTestToken();
    let domainId;
    
    // 1. 测试健康检查端点
    console.log('\n1. 测试健康检查端点...');
    const healthResponse = await request(app).get('/health');
    console.log(`   状态码: ${healthResponse.status}`);
    if (healthResponse.status === 200) {
      console.log('   ✓ 健康检查通过');
    } else {
      console.log('   ✗ 健康检查失败');
    }
    
    // 2. 测试创建域名（需要JWT认证）
    console.log('\n2. 测试创建域名...');
    const createResponse = await request(app)
      .post('/api/v1/domains')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        name: 'example.com',
        description: '测试域名',
        targetAddress: '192.168.1.1',
        recordType: 'A',
        ttl: 3600,
        admin: 'admin123',
        enabled: true,
      });
    console.log(`   状态码: ${createResponse.status}`);
    if (createResponse.status === 201) {
      console.log('   ✓ 创建域名通过');
      domainId = createResponse.body.data.id;
    } else {
      console.log('   ✗ 创建域名失败');
      console.log(`   错误信息: ${JSON.stringify(createResponse.body)}`);
    }
    
    // 3. 测试获取所有域名（需要JWT认证）
    console.log('\n3. 测试获取所有域名...');
    const getAllResponse = await request(app)
      .get('/api/v1/domains')
      .set('Authorization', `Bearer ${testToken}`);
    console.log(`   状态码: ${getAllResponse.status}`);
    if (getAllResponse.status === 200) {
      console.log('   ✓ 获取所有域名通过');
    } else {
      console.log('   ✗ 获取所有域名失败');
      console.log(`   错误信息: ${JSON.stringify(getAllResponse.body)}`);
    }
    
    // 4. 测试未认证访问（应该失败）
    console.log('\n4. 测试未认证访问...');
    const unauthResponse = await request(app).get('/api/v1/domains');
    console.log(`   状态码: ${unauthResponse.status}`);
    if (unauthResponse.status === 401) {
      console.log('   ✓ 未认证访问测试通过：正确返回了401错误');
    } else {
      console.log('   ✗ 未认证访问测试失败：应该返回401错误，但实际返回了', unauthResponse.status);
    }
    
    console.log('\n测试完成！');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
    process.exit(1);
  } finally {
    // 释放存储服务资源
    await storageService.release();
  }
};

// 运行测试
runTests();
