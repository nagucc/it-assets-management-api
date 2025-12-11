import request from 'supertest';
import { app } from '../app';
import { storageService } from '../services/storage.service';

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

describe('API集成测试', () => {
  // 测试健康检查端点
  describe('健康检查', () => {
    it('应该返回200状态码和正常状态', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.message).toBe('IT资源管理API系统运行正常');
    });
  });

  // 测试域名管理
  describe('域名管理', () => {
    let domainId: string;

    // 创建域名
    it('应该创建一个新域名', async () => {
      const response = await request(app)
        .post('/api/v1/domains')
        .send({
          name: 'example.com',
          description: '测试域名',
          targetAddress: '192.168.1.1',
          recordType: 'A',
          ttl: 3600,
          admin: 'admin123',
          enabled: true,
        });
      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('example.com');
      domainId = response.body.data.id;
    });

    // 获取所有域名
    it('应该获取所有域名', async () => {
      const response = await request(app).get('/api/v1/domains');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    // 根据ID获取域名
    it('应该根据ID获取域名', async () => {
      const response = await request(app).get(`/api/v1/domains/${domainId}`);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(domainId);
    });

    // 更新域名
    it('应该更新域名信息', async () => {
      const response = await request(app)
        .put(`/api/v1/domains/${domainId}`)
        .send({
          name: 'updated-example.com',
          description: '更新后的测试域名',
        });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('updated-example.com');
    });

    // 更新域名状态
    it('应该更新域名状态', async () => {
      const response = await request(app)
        .patch(`/api/v1/domains/${domainId}/status`)
        .send({
          enabled: false,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.enabled).toBe(false);
    });

    // 根据记录类型获取域名
    it('应该根据记录类型获取域名', async () => {
      const response = await request(app).get('/api/v1/domains/type/A');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    // 根据状态获取域名
    it('应该根据状态获取域名', async () => {
      const response = await request(app).get('/api/v1/domains/status/disabled');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    // 删除域名
    it('应该删除域名', async () => {
      const response = await request(app).delete(`/api/v1/domains/${domainId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Domain deleted successfully');
    });
  });
});