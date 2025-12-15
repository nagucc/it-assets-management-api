import swaggerJSDoc from 'swagger-jsdoc';

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '域名管理API',
      version: '1.0.0',
      description: '基于Node.js和Express开发的域名管理API系统，支持域名的创建、查询、更新和删除等功能',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发环境',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        Domain: {
          type: 'object',
          required: ['name', 'description', 'targetAddress', 'recordType', 'admin'],
          properties: {
            id: {
              type: 'string',
              description: '域名ID',
            },
            name: {
              type: 'string',
              description: '域名名称',
            },
            description: {
              type: 'string',
              description: '域名描述',
            },
            targetAddress: {
              type: 'string',
              description: '目标地址',
            },
            recordType: {
              type: 'string',
              enum: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'PTR', 'SRV', 'CAA'],
              description: 'DNS记录类型',
            },
            ttl: {
              type: 'number',
              description: 'TTL值',
              nullable: true,
            },
            priority: {
              type: 'number',
              description: '优先级',
              nullable: true,
            },
            admin: {
              type: 'string',
              description: '管理员ID',
            },
            enabled: {
              type: 'boolean',
              description: '是否启用',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '创建时间',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '更新时间',
            },
            creator: {
              type: 'string',
              description: '创建者',
              nullable: true,
            },
            updater: {
              type: 'string',
              description: '更新者',
              nullable: true,
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '标签',
              nullable: true,
            },
            metadata: {
              type: 'object',
              description: '元数据',
              nullable: true,
            },
          },
        },
        DomainRequest: {
          type: 'object',
          required: ['name', 'description', 'targetAddress', 'recordType', 'admin'],
          properties: {
            name: {
              type: 'string',
              description: '域名名称',
            },
            description: {
              type: 'string',
              description: '域名描述',
            },
            targetAddress: {
              type: 'string',
              description: '目标地址',
            },
            recordType: {
              type: 'string',
              enum: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'PTR', 'SRV', 'CAA'],
              description: 'DNS记录类型',
            },
            ttl: {
              type: 'number',
              description: 'TTL值',
              nullable: true,
            },
            priority: {
              type: 'number',
              description: '优先级',
              nullable: true,
            },
            admin: {
              type: 'string',
              description: '管理员ID',
            },
            enabled: {
              type: 'boolean',
              description: '是否启用',
              default: true,
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '标签',
              nullable: true,
            },
            metadata: {
              type: 'object',
              description: '元数据',
              nullable: true,
            },
          },
        },
        DomainUpdateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '域名名称',
            },
            description: {
              type: 'string',
              description: '域名描述',
            },
            targetAddress: {
              type: 'string',
              description: '目标地址',
            },
            recordType: {
              type: 'string',
              enum: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'PTR', 'SRV', 'CAA'],
              description: 'DNS记录类型',
            },
            ttl: {
              type: 'number',
              description: 'TTL值',
              nullable: true,
            },
            priority: {
              type: 'number',
              description: '优先级',
              nullable: true,
            },
            admin: {
              type: 'string',
              description: '管理员ID',
            },
            enabled: {
              type: 'boolean',
              description: '是否启用',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: '标签',
              nullable: true,
            },
            metadata: {
              type: 'object',
              description: '元数据',
              nullable: true,
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: []
      }
    ],
  },
  apis: ['./src/routes/domain.routes.ts', './src/controllers/domain.controller.ts']
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);