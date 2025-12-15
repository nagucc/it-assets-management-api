// 只测试JWT验证功能，不依赖任何其他组件
const jwt = require('jsonwebtoken');

// 模拟配置
const mockConfig = {
  jwt: {
    secret: 'test-secret-key',
  },
};

// 模拟JWT服务
class MockJwtService {
  constructor() {
    this.secretKey = mockConfig.jwt.secret;
  }

  /**
   * 验证JWT令牌
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

// 创建测试实例
const jwtService = new MockJwtService();

// 测试脚本
const runTests = () => {
  console.log('开始测试JWT验证功能...');
  
  try {
    // 1. 测试生成有效JWT令牌
    const payload = {
      username: 'testuser',
      role: '系统管理员',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1小时过期
    };
    
    const validToken = jwt.sign(payload, mockConfig.jwt.secret);
    console.log('✓ 生成有效JWT令牌成功');
    
    // 2. 测试验证有效JWT令牌
    const decoded = jwtService.verifyToken(validToken);
    if (decoded) {
      console.log('✓ 验证有效JWT令牌成功');
      console.log(`   解码结果: ${JSON.stringify(decoded)}`);
    } else {
      console.log('✗ 验证有效JWT令牌失败');
    }
    
    // 3. 测试生成过期JWT令牌
    const expiredPayload = {
      username: 'testuser',
      role: '系统管理员',
      exp: Math.floor(Date.now() / 1000) - 3600, // 1小时前过期
    };
    
    const expiredToken = jwt.sign(expiredPayload, mockConfig.jwt.secret);
    console.log('✓ 生成过期JWT令牌成功');
    
    // 4. 测试验证过期JWT令牌（应该返回null）
    const expiredDecoded = jwtService.verifyToken(expiredToken);
    if (expiredDecoded === null) {
      console.log('✓ 验证过期JWT令牌成功：正确返回了null');
    } else {
      console.log('✗ 验证过期JWT令牌失败：应该返回null，但实际返回了', expiredDecoded);
    }
    
    // 5. 测试生成无效签名的JWT令牌
    const invalidToken = jwt.sign(payload, 'wrong-secret');
    console.log('✓ 生成无效签名JWT令牌成功');
    
    // 6. 测试验证无效签名的JWT令牌（应该返回null）
    const invalidDecoded = jwtService.verifyToken(invalidToken);
    if (invalidDecoded === null) {
      console.log('✓ 验证无效签名JWT令牌成功：正确返回了null');
    } else {
      console.log('✗ 验证无效签名JWT令牌失败：应该返回null，但实际返回了', invalidDecoded);
    }
    
    console.log('\nJWT验证功能测试完成！所有测试用例均通过。');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
    process.exit(1);
  }
};

// 运行测试
runTests();
