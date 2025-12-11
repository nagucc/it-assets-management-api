import { DomainManager, DomainManagerConfig } from 'it-assets-management-models';
import { config } from '../config';
import { logger } from '../middleware/logger';

// 模拟DomainManager实现，用于本地测试
class MockDomainManager {
  private data: Map<string, any> = new Map();
  private counter = 0;

  async initialize(config: any): Promise<void> {
    logger.info('Mock DomainManager initialized');
  }

  async createDomain(domainData: any): Promise<any> {
    const id = `domain-${++this.counter}`;
    const now = new Date().toISOString();
    const domain = {
      id,
      ...domainData,
      admin: domainData.admin || 'admin',
      createdAt: now,
      updatedAt: now,
    };
    this.data.set(id, domain);
    return domain;
  }

  async getDomainById(id: string): Promise<any | null> {
    return this.data.get(id) || null;
  }

  async getDomainByName(name: string): Promise<any | null> {
    for (const domain of this.data.values()) {
      if (domain.name === name) {
        return domain;
      }
    }
    return null;
  }

  async updateDomain(id: string, domainData: any): Promise<any> {
    const domain = this.data.get(id);
    if (!domain) {
      throw new Error(`Domain not found: ${id}`);
    }
    const updatedDomain = {
      ...domain,
      ...domainData,
      updatedAt: new Date().toISOString(),
    };
    this.data.set(id, updatedDomain);
    return updatedDomain;
  }

  async deleteDomain(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  async findDomains(query?: any, options?: any): Promise<any[]> {
    let result = Array.from(this.data.values());
    
    // 应用查询条件
    if (query) {
      if (query.recordType) {
        result = result.filter(domain => domain.recordType === query.recordType);
      }
      if (query.targetAddress) {
        result = result.filter(domain => domain.targetAddress === query.targetAddress);
      }
    }
    
    // 应用排序和分页
    if (options) {
      if (options.sort) {
        // 简单排序实现
      }
      if (options.limit) {
        result = result.slice(0, options.limit);
      }
      if (options.offset) {
        result = result.slice(options.offset);
      }
    }
    
    return result;
  }

  async toggleDomainStatus(id: string, enabled: boolean): Promise<any> {
    const domain = this.data.get(id);
    if (!domain) {
      throw new Error(`Domain not found: ${id}`);
    }
    const updatedDomain = {
      ...domain,
      enabled,
      updatedAt: new Date().toISOString(),
    };
    this.data.set(id, updatedDomain);
    return updatedDomain;
  }

  async close(): Promise<void> {
    logger.info('Mock DomainManager closed');
  }
}

// 存储服务类
export class StorageService {
  private domainManager: any = null;

  // 初始化存储服务
  public async initialize(): Promise<void> {
    try {
      // 创建并初始化Mock DomainManager
      this.domainManager = new MockDomainManager();
      await this.domainManager.initialize({
        persistence: {
          storageType: 'memory',
          storageConfig: {
            type: 'memory',
          },
        },
      });
      logger.info(`Storage service initialized with mock adapter`);
    } catch (error) {
      logger.error(`Failed to initialize storage service: ${(error as Error).message}`);
      throw error;
    }
  }

  // 获取域名管理器实例
  public getDomainManager(): any {
    if (!this.domainManager) {
      throw new Error('Storage service not initialized');
    }
    return this.domainManager;
  }

  // 释放资源
  public async release(): Promise<void> {
    if (this.domainManager) {
      await this.domainManager.close();
      logger.info('Storage service released');
    }
  }
}

// 创建单例实例
export const storageService = new StorageService();