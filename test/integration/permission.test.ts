import request from 'supertest';
import { app } from '../../src/app';
import { storageService } from '../../src/services/storage.service';
import { generateTestToken } from '../utils/test-helpers';

// 测试前初始化
beforeAll(async () => {
  // 确保存储服务已初始化
  await storageService.initialize();
});

// 测试后清理
afterAll(async () => {
  // 释放存储服务资源
  await storageService.release();
});

describe('权限控制测试', () => {
  // 系统管理员令牌
  const adminToken = generateTestToken('admin', '系统管理员');
  
  // 普通用户1令牌
  const user1Token = generateTestToken('user1', '普通用户');
  
  // 普通用户2令牌
  const user2Token = generateTestToken('user2', '普通用户');
  
  let adminDomainId: string;
  let user1DomainId: string;
  
  // 创建测试域名
  beforeAll(async () => {
    // 系统管理员创建一个域名
    const adminResponse = await request(app)
      .post('/api/v1/domains')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'admin-domain.com',
        description: '系统管理员创建的域名',
        targetAddress: '192.168.1.1',
        recordType: 'A',
        admin: 'admin',
        enabled: true,
      });
    adminDomainId = adminResponse.body.data.id;
    
    // 普通用户1创建一个域名
    const user1Response = await request(app)
      .post('/api/v1/domains')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'user1-domain.com',
        description: '普通用户1创建的域名',
        targetAddress: '192.168.1.2',
        recordType: 'A',
        admin: 'user1',
        enabled: true,
      });
    user1DomainId = user1Response.body.data.id;
  });
  
  // 系统管理员权限测试
  describe('系统管理员权限', () => {
    it('应该可以访问所有域名列表', async () => {
      const response = await request(app)
        .get('/api/v1/domains')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(2);
    });
    
    it('应该可以访问普通用户创建的域名', async () => {
      const response = await request(app)
        .get(`/api/v1/domains/${user1DomainId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(user1DomainId);
    });
    
    it('应该可以更新普通用户创建的域名', async () => {
      const response = await request(app)
        .put(`/api/v1/domains/${user1DomainId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: '系统管理员更新的域名描述',
        });
      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe('系统管理员更新的域名描述');
    });
    
    it('应该可以删除普通用户创建的域名', async () => {
      // 创建一个临时域名用于测试删除
      const tempResponse = await request(app)
        .post('/api/v1/domains')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'temp-user1-domain.com',
          description: '临时测试域名',
          targetAddress: '192.168.1.3',
          recordType: 'A',
          admin: 'user1',
          enabled: true,
        });
      const tempDomainId = tempResponse.body.data.id;
      
      // 系统管理员删除该域名
      const deleteResponse = await request(app)
        .delete(`/api/v1/domains/${tempDomainId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('Domain deleted successfully');
    });
  });
  
  // 普通用户权限测试
  describe('普通用户权限', () => {
    it('应该只能访问自己创建的域名列表', async () => {
      const response = await request(app)
        .get('/api/v1/domains')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      // 过滤后应该只有自己创建的域名
      const userDomains = response.body.data.filter((domain: any) => domain.admin === 'user1');
      expect(response.body.count).toBe(userDomains.length);
    });
    
    it('应该可以访问自己创建的域名', async () => {
      const response = await request(app)
        .get(`/api/v1/domains/${user1DomainId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(user1DomainId);
    });
    
    it('应该无法访问系统管理员创建的域名', async () => {
      const response = await request(app)
        .get(`/api/v1/domains/${adminDomainId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PERMISSION_DENIED');
    });
    
    it('应该无法访问其他普通用户创建的域名', async () => {
      // 普通用户2创建一个域名
      const user2Response = await request(app)
        .post('/api/v1/domains')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          name: 'user2-domain.com',
          description: '普通用户2创建的域名',
          targetAddress: '192.168.1.3',
          recordType: 'A',
          admin: 'user2',
          enabled: true,
        });
      const user2DomainId = user2Response.body.data.id;
      
      // 普通用户1尝试访问普通用户2的域名
      const response = await request(app)
        .get(`/api/v1/domains/${user2DomainId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PERMISSION_DENIED');
    });
    
    it('应该可以更新自己创建的域名', async () => {
      const response = await request(app)
        .put(`/api/v1/domains/${user1DomainId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          description: '普通用户1更新的域名描述',
        });
      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe('普通用户1更新的域名描述');
    });
    
    it('应该无法更新系统管理员创建的域名', async () => {
      const response = await request(app)
        .put(`/api/v1/domains/${adminDomainId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          description: '普通用户尝试更新系统管理员域名',
        });
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PERMISSION_DENIED');
    });
    
    it('应该可以删除自己创建的域名', async () => {
      // 创建一个临时域名用于测试删除
      const tempResponse = await request(app)
        .post('/api/v1/domains')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'temp-delete-domain.com',
          description: '临时测试删除域名',
          targetAddress: '192.168.1.4',
          recordType: 'A',
          admin: 'user1',
          enabled: true,
        });
      const tempDomainId = tempResponse.body.data.id;
      
      // 普通用户1删除自己的域名
      const deleteResponse = await request(app)
        .delete(`/api/v1/domains/${tempDomainId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('Domain deleted successfully');
    });
    
    it('应该无法删除系统管理员创建的域名', async () => {
      const response = await request(app)
        .delete(`/api/v1/domains/${adminDomainId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PERMISSION_DENIED');
    });
    
    it('应该只能创建自己为管理员的域名', async () => {
      // 尝试创建其他用户为管理员的域名
      const response = await request(app)
        .post('/api/v1/domains')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'other-admin-domain.com',
          description: '尝试创建其他用户为管理员的域名',
          targetAddress: '192.168.1.5',
          recordType: 'A',
          admin: 'user2',
          enabled: true,
        });
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PERMISSION_DENIED');
      
      // 可以创建自己为管理员的域名
      const validResponse = await request(app)
        .post('/api/v1/domains')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: 'valid-user1-domain.com',
          description: '有效创建自己为管理员的域名',
          targetAddress: '192.168.1.6',
          recordType: 'A',
          admin: 'user1',
          enabled: true,
        });
      expect(validResponse.status).toBe(201);
      expect(validResponse.body.data.admin).toBe('user1');
    });
  });
  
  // 无效角色权限测试
  describe('无效角色权限', () => {
    it('应该拒绝无效角色访问API端点', async () => {
      // 生成一个带有无效角色"user1"的令牌
      const invalidRoleToken = generateTestToken('user1', 'user1');
      
      // 尝试访问API端点
      const response = await request(app)
        .get('/api/v1/domains')
        .set('Authorization', `Bearer ${invalidRoleToken}`);
      
      // 验证系统返回403状态码
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PERMISSION_DENIED');
    });
  });
});
