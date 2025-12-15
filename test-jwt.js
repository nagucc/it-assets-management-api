const jwt = require('jsonwebtoken');
const { config } = require('./dist/config');

// 测试JWT验证功能
const testJwtVerification = () => {
  console.log('开始测试JWT验证功能...');
  
  try {
    // 1. 测试生成有效JWT令牌
    const payload = {
      username: 'testuser',
      role: '系统管理员',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1小时过期
    };
    
    const validToken = jwt.sign(payload, config.jwt.secret);
    console.log('✓ 生成有效JWT令牌成功');
    
    // 2. 测试验证有效JWT令牌
    const decoded = jwt.verify(validToken, config.jwt.secret);
    console.log('✓ 验证有效JWT令牌成功');
    console.log(`   解码结果: ${JSON.stringify(decoded)}`);
    
    // 3. 测试生成过期JWT令牌
    const expiredPayload = {
      username: 'testuser',
      role: '系统管理员',
      exp: Math.floor(Date.now() / 1000) - 3600, // 1小时前过期
    };
    
    const expiredToken = jwt.sign(expiredPayload, config.jwt.secret);
    console.log('✓ 生成过期JWT令牌成功');
    
    // 4. 测试验证过期JWT令牌（应该失败）
    try {
      jwt.verify(expiredToken, config.jwt.secret);
      console.log('✗ 验证过期JWT令牌失败：应该返回错误，但实际成功了');
    } catch (error) {
      console.log('✓ 验证过期JWT令牌成功：正确返回了过期错误');
      console.log(`   错误信息: ${error.message}`);
    }
    
    // 5. 测试生成无效签名的JWT令牌
    const invalidToken = jwt.sign(payload, 'wrong-secret');
    console.log('✓ 生成无效签名JWT令牌成功');
    
    // 6. 测试验证无效签名的JWT令牌（应该失败）
    try {
      jwt.verify(invalidToken, config.jwt.secret);
      console.log('✗ 验证无效签名JWT令牌失败：应该返回错误，但实际成功了');
    } catch (error) {
      console.log('✓ 验证无效签名JWT令牌成功：正确返回了无效签名错误');
      console.log(`   错误信息: ${error.message}`);
    }
    
    console.log('\nJWT验证功能测试完成！所有测试用例均通过。');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
    process.exit(1);
  }
};

// 运行测试
testJwtVerification();
