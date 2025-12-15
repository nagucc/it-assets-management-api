# 测试文件结构迁移说明文档

本文档详细说明项目测试文件从原有结构迁移到统一的`/test`目录下的变更情况。

## 变更目的

将所有测试相关文件集中管理，提高项目结构的清晰度和可维护性，遵循行业最佳实践，将源代码与测试代码分离。

## 新测试目录结构

```
/test
  /integration  # 集成测试文件
  /unit         # 单元测试文件（预留）
  /utils        # 测试辅助工具文件
  /misc         # 其他各类测试脚本
```

## 文件迁移路径对照表

| 旧路径 | 新路径 | 备注 |
|--------|--------|------|
| `src/__tests__/integration.test.ts` | `test/integration/integration.test.ts` | 集成测试文件 |
| `src/__tests__/test-helpers.ts` | `test/utils/test-helpers.ts` | 测试辅助工具 |
| `test-jwt-exp-required.js` | `test/misc/test-jwt-exp-required.js` | JWT测试脚本 |
| `test-jwt-only.js` | `test/misc/test-jwt-only.js` | JWT测试脚本 |
| `test-jwt-service.js` | `test/misc/test-jwt-service.js` | JWT测试脚本 |
| `test-jwt.js` | `test/misc/test-jwt.js` | JWT测试脚本 |
| `test-api.js` | `test/misc/test-api.js` | API测试脚本 |
| `simple-test.js` | `test/misc/simple-test.js` | 简单测试脚本 |

## 配置文件更新

### jest.config.js 变更

1. 修改了`testMatch`配置，将测试文件匹配模式从`**/__tests__/**/*`更改为`**/test/**/*`
2. 更新了`rootDir`从`./src`改为`.`
3. 调整了`coverageDirectory`路径从`../coverage`改为`./coverage`
4. 修改了`collectCoverageFrom`配置，移除了`!src/**/__tests__/**`排除规则
5. 更新了`testPathIgnorePatterns`配置，忽略`/test/utils/`目录

## 导入路径更新

所有迁移的测试文件中的导入路径都已更新，确保它们能正确引用项目源代码：

- 原导入路径如`../app`更改为`../../src/app`
- 原导入路径如`./test-helpers`更改为`../utils/test-helpers`
- 原导入路径如`./dist/app`更改为`../../dist/app`

## 验证结果

迁移后已执行以下验证测试：

1. 项目构建成功 (`npm run build`)
2. Jest测试全部通过 (`npm test`)
3. 单独JWT测试脚本运行正常 (`node test/misc/test-jwt-exp-required.js`)

## 注意事项

1. **原始测试文件保留**：为了保证兼容性，原有`src/__tests__/`目录下的文件暂未删除
2. **依赖更新**：使用测试脚本时，需要先构建项目以确保`dist`目录存在
3. **后续维护**：建议新的测试文件都按照新的目录结构添加到相应子目录中

## 后续建议

1. 在团队熟悉新结构后，可考虑清理旧的测试文件
2. 根据测试类型，将更多测试文件归类到合适的子目录中
3. 为新的测试目录结构添加相关文档到项目README中
