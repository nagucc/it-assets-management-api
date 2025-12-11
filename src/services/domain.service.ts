import { Domain, DnsRecordType } from 'it-assets-management-models';
import { storageService } from './storage.service';
import { logger } from '../middleware/logger';

// 手动定义类型，因为包没有导出这些类型
export interface CreateDomainData {
  name: string;
  description: string;
  targetAddress: string;
  recordType: DnsRecordType;
  ttl?: number;
  priority?: number | null;
  admin: string;
  enabled?: boolean;
  creator?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateDomainData {
  name?: string;
  description?: string;
  targetAddress?: string;
  recordType?: DnsRecordType;
  ttl?: number;
  priority?: number | null;
  admin?: string;
  enabled?: boolean;
  updater?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// 域名服务类
export class DomainService {
  // 创建域名
  public async createDomain(domainData: CreateDomainData): Promise<Domain> {
    try {
      const domainManager = storageService.getDomainManager();
      const domain = await domainManager.createDomain(domainData);
      logger.info(`Created domain: ${domain.name}`);
      return domain;
    } catch (error) {
      logger.error(`Failed to create domain: ${(error as Error).message}`);
      throw error;
    }
  }

  // 获取所有域名
  public async getAllDomains(): Promise<Domain[]> {
    try {
      const domainManager = storageService.getDomainManager();
      const domains = await domainManager.findDomains();
      return domains;
    } catch (error) {
      logger.error(`Failed to get all domains: ${(error as Error).message}`);
      throw error;
    }
  }

  // 根据ID获取域名
  public async getDomainById(id: string): Promise<Domain | null> {
    try {
      const domainManager = storageService.getDomainManager();
      const domain = await domainManager.getDomainById(id);
      return domain;
    } catch (error) {
      logger.error(`Failed to get domain by ID ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  // 根据名称获取域名
  public async getDomainByName(name: string): Promise<Domain | null> {
    try {
      const domainManager = storageService.getDomainManager();
      const domain = await domainManager.getDomainByName(name);
      return domain;
    } catch (error) {
      logger.error(`Failed to get domain by name ${name}: ${(error as Error).message}`);
      throw error;
    }
  }

  // 更新域名
  public async updateDomain(id: string, domainData: UpdateDomainData): Promise<Domain> {
    try {
      const domainManager = storageService.getDomainManager();
      const updatedDomain = await domainManager.updateDomain(id, domainData);
      logger.info(`Updated domain: ${updatedDomain.name}`);
      return updatedDomain;
    } catch (error) {
      logger.error(`Failed to update domain ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  // 删除域名
  public async deleteDomain(id: string): Promise<void> {
    try {
      const domainManager = storageService.getDomainManager();
      await domainManager.deleteDomain(id);
      logger.info(`Deleted domain: ${id}`);
    } catch (error) {
      logger.error(`Failed to delete domain ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  // 更新域名状态
  public async updateDomainStatus(id: string, enabled: boolean): Promise<Domain> {
    try {
      const domainManager = storageService.getDomainManager();
      const updatedDomain = await domainManager.toggleDomainStatus(id, enabled);
      logger.info(`Updated domain status: ${id} -> ${enabled ? 'enabled' : 'disabled'}`);
      return updatedDomain;
    } catch (error) {
      logger.error(`Failed to update domain status ${id}: ${(error as Error).message}`);
      throw error;
    }
  }

  // 根据记录类型获取域名
  public async getDomainsByType(recordType: string): Promise<Domain[]> {
    try {
      const domainManager = storageService.getDomainManager();
      const domains = await domainManager.findDomains({
        recordType: recordType as DnsRecordType,
      });
      return domains;
    } catch (error) {
      logger.error(`Failed to get domains by type ${recordType}: ${(error as Error).message}`);
      throw error;
    }
  }

  // 根据状态获取域名
  public async getDomainsByStatus(enabled: boolean): Promise<Domain[]> {
    try {
      const domainManager = storageService.getDomainManager();
      const domains = await domainManager.findDomains({
        enabled,
      });
      return domains;
    } catch (error) {
      logger.error(`Failed to get domains by status ${enabled}: ${(error as Error).message}`);
      throw error;
    }
  }
}

// 创建单例实例
export const domainService = new DomainService();