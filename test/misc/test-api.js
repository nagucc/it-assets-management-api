const request = require('supertest');
const { app, startServer } = require('../../dist/app');
const { storageService } = require('../../dist/services/storage.service');
const jwt = require('jsonwebtoken');
const { config } = require('../../dist/config');

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
    console.log(`   响应: ${JSON.stringify(healthResponse.body)}`);
    
    if (healthResponse.status === 200) {
      console.log('   ✓ 健康检查通过');
    } else {
      console.log('   ✗ 健康检查失败');
    }
    
    // 2. 测试创建域名
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
    console.log(`   响应: ${JSON.stringify(createResponse.body)}`);
    
    if (createResponse.status === 201) {
      console.log('   ✓ 创建域名通过');
      domainId = createResponse.body.data.id;
    } else {
      console.log('   ✗ 创建域名失败');
    }
    
    // 3. 测试获取所有域名
    console.log('\n3. 测试获取所有域名...');
    const getAllResponse = await request(app)
      .get('/api/v1/domains')
      .set('Authorization', `Bearer ${testToken}`);
    console.log(`   状态码: ${getAllResponse.status}`);
    console.log(`   响应: ${JSON.stringify(getAllResponse.body)}`);
    
    if (getAllResponse.status === 200) {
      console.log('   ✓ 获取所有域名通过');
    } else {
      console.log('   ✗ 获取所有域名失败');
    }
    
    // 4. 测试根据ID获取域名
    if (domainId) {
      console.log('\n4. 测试根据ID获取域名...');
      const getByIdResponse = await request(app)
        .get(`/api/v1/domains/${domainId}`)
        .set('Authorization', `Bearer ${testToken}`);
      console.log(`   状态码: ${getByIdResponse.status}`);
      console.log(`   响应: ${JSON.stringify(getByIdResponse.body)}`);
      
      if (getByIdResponse.status === 200) {
        console.log('   ✓ 根据ID获取域名通过');
      } else {
        console.log('   ✗ 根据ID获取域名失败');
      }
    }
    
    // 5. 测试更新域名
    if (domainId) {
      console.log('\n5. 测试更新域名...');
      const updateResponse = await request(app)
        .put(`/api/v1/domains/${domainId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          name: 'updated-example.com',
          description: '更新后的测试域名',
        });
      console.log(`   状态码: ${updateResponse.status}`);
      console.log(`   响应: ${JSON.stringify(updateResponse.body)}`);
      
      if (updateResponse.status === 200) {
        console.log('   ✓ 更新域名通过');
      } else {
        console.log('   ✗ 更新域名失败');
      }
    }
    
    // 6. 测试更新域名状态
    if (domainId) {
      console.log('\n6. 测试更新域名状态...');
      const updateStatusResponse = await request(app)
        .patch(`/api/v1/domains/${domainId}/status`)
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          enabled: false,
        });
      console.log(`   状态码: ${updateStatusResponse.status}`);
      console.log(`   响应: ${JSON.stringify(updateStatusResponse.body)}`);
      
      if (updateStatusResponse.status === 200) {
        console.log('   ✓ 更新域名状态通过');
      } else {
        console.log('   ✗ 更新域名状态失败');
      }
    }
    
    // 7. 测试根据记录类型获取域名
    console.log('\n7. 测试根据记录类型获取域名...');
    const getByTypeResponse = await request(app)
      .get('/api/v1/domains/type/A')
      .set('Authorization', `Bearer ${testToken}`);
    console.log(`   状态码: ${getByTypeResponse.status}`);
    console.log(`   响应: ${JSON.stringify(getByTypeResponse.body)}`);
    
    if (getByTypeResponse.status === 200) {
      console.log('   ✓ 根据记录类型获取域名通过');
    } else {
      console.log('   ✗ 根据记录类型获取域名失败');
    }
    
    // 8. 测试根据状态获取域名
    console.log('\n8. 测试根据状态获取域名...');
    const getByStatusResponse = await request(app)
      .get('/api/v1/domains/status/disabled')
      .set('Authorization', `Bearer ${testToken}`);
    console.log(`   状态码: ${getByStatusResponse.status}`);
    console.log(`   响应: ${JSON.stringify(getByStatusResponse.body)}`);
    
    if (getByStatusResponse.status === 200) {
      console.log('   ✓ 根据状态获取域名通过');
    } else {
      console.log('   ✗ 根据状态获取域名失败');
    }
    
    // 9. 测试删除域名
    if (domainId) {
      console.log('\n9. 测试删除域名...');
      const deleteResponse = await request(app)
        .delete(`/api/v1/domains/${domainId}`)
        .set('Authorization', `Bearer ${testToken}`);
      console.log(`   状态码: ${deleteResponse.status}`);
      console.log(`   响应: ${JSON.stringify(deleteResponse.body)}`);
      
      if (deleteResponse.status === 200) {
        console.log('   ✓ 删除域名通过');
      } else {
        console.log('   ✗ 删除域名失败');
      }
    }
    
    console.log('\n测试完成！');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  } finally {
    // 释放存储服务资源
    await storageService.release();
  }
};

// 运行测试
runTests();
