# 第一阶段：构建阶段
FROM node:20.18.0-alpine3.20 AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN --mount=type=secret,id=NPMRC_CONTENT,mode=0644,required=false \
    if [ -f /run/secrets/NPMRC_CONTENT ]; then \
        cp /run/secrets/NPMRC_CONTENT /root/.npmrc; \
    fi && \
    npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 第二阶段：生产阶段
FROM node:20.18.0-alpine3.20 AS production

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装生产依赖
RUN --mount=type=secret,id=NPMRC_CONTENT,mode=0644,required=false \
    if [ -f /run/secrets/NPMRC_CONTENT ]; then \
        cp /run/secrets/NPMRC_CONTENT /root/.npmrc; \
    fi && \
    npm ci --only=production && \
    rm -f /root/.npmrc

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env.example ./

# 暴露API端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]