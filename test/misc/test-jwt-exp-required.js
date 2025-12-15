const jwt = require('jsonwebtoken');
const { jwtService } = require('../../dist/services/jwt.service');
const { config } = require('../../dist/config');

// 测试JWT exp字段必需规则
const testJwtExpRequired = () => {
  console.log('开始测试JWT exp字段必需规则...');
  
  try {
    // 1. 测试包含exp字段的有效JWT令牌
    const validPayload = {
      username: 'testuser',
      role: '系统管理员',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1小时过期
    };
    
    const validToken = jwt.sign(validPayload, config.jwt.secret);
    console.log('✓ 生成包含exp字段的有效令牌');
    
    const validDecoded = jwtService.verifyToken(validToken);
    if (validDecoded) {
      console.log('✓ 验证包含exp字段的令牌成功：令牌被接受');
    } else {
      console.log('✗ 验证包含exp字段的令牌失败：令牌被错误拒绝');
      process.exit(1);
    }
    
    // 2. 测试不包含exp字段的JWT令牌（根据新规则应该被拒绝）
    const invalidPayload = {
      username: 'testuser',
      role: '系统管理员',
      // 故意不包含exp字段
    };
    
    const invalidToken = jwt.sign(invalidPayload, config.jwt.secret);
    console.log('✓ 生成不包含exp字段的令牌');
    
    const invalidDecoded = jwtService.verifyToken(invalidToken);
    if (invalidDecoded === null) {
      console.log('✓ 验证不包含exp字段的令牌成功：令牌被正确拒绝');
    } else {
      console.log('✗ 验证不包含exp字段的令牌失败：令牌应该被拒绝但被接受了');
      process.exit(1);
    }
    
    console.log('\n✅ JWT exp字段必需规则测试完成！所有测试用例均通过。');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
    process.exit(1);
  }
};

// 运行测试
testJwtExpRequired();