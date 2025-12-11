# 使用Node.js官方镜像作为基础镜像
FROM node:20.18.0-alpine3.20

# 设置工作目录
WORKDIR /app

# 使用npmrc secret if available
ARG NPMRC_CONTENT
RUN if [ -n "$NPMRC_CONTENT" ]; then echo "$NPMRC_CONTENT" > /root/.npmrc; fi

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖（包括开发依赖，因为需要构建项目）
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 安装生产依赖
RUN npm ci --only=production

# 暴露API端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]