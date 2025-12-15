# 使用Node.js官方镜像作为基础镜像
FROM node:20.18.0-alpine3.20

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖（包括开发依赖，因为需要构建项目）
RUN --mount=type=secret,id=NPMRC_CONTENT,mode=0644,required=false \
    if [ -f /run/secrets/NPMRC_CONTENT ]; then \
        cp /run/secrets/NPMRC_CONTENT /root/.npmrc; \
    fi && \
    npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 安装生产依赖
RUN --mount=type=secret,id=NPMRC_CONTENT,mode=0644,required=false \
    if [ -f /run/secrets/NPMRC_CONTENT ]; then \
        cp /run/secrets/NPMRC_CONTENT /root/.npmrc; \
    fi && \
    npm ci --only=production

# 暴露API端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]