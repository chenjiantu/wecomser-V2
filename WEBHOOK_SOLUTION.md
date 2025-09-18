# 🔧 Webhook CORS问题解决方案

## 🚨 问题确认
正如预期，您遇到的是典型的CORS跨域问题：
```
Access to fetch at 'https://qyapi.weixin.qq.com/...' has been blocked by CORS policy
```

企业微信API不允许从浏览器直接调用，这是安全策略。

## 💡 解决方案：代理服务器

我已经为您创建了一个完整的Node.js代理服务器解决方案。

### 📁 文件结构
```
webhook-proxy-server.js  # 代理服务器主文件
package.json            # 依赖配置
test-webhook.js         # 测试脚本
script.js              # 前端代码已更新
```

### 🚀 快速部署步骤

#### 1. 安装依赖
```bash
npm install
```

#### 2. 启动代理服务器
```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev
```

#### 3. 测试连接
```bash
# 运行测试脚本
npm test

# 或者在浏览器控制台测试
testWebhook()
```

### 🔧 配置说明

#### 代理服务器配置
- **端口**: 3001
- **CORS**: 已配置允许您的域名
- **超时**: 10秒
- **错误处理**: 完善的错误分类和提示

#### 前端配置（已自动更新）
```javascript
const WEBHOOK_CONFIG = {
    url: window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api/webhook'  // 本地开发
        : 'http://test.wecomser.cloud:3001/api/webhook', // 生产环境
    timeout: 10000,
    retryCount: 2
};
```

### 🌐 部署到服务器

#### 方式1：PM2部署（推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动服务
pm2 start webhook-proxy-server.js --name "webhook-proxy"

# 查看状态
pm2 status

# 查看日志
pm2 logs webhook-proxy
```

#### 方式2：Docker部署
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

#### 方式3：直接运行
```bash
# 后台运行
nohup npm start > webhook.log 2>&1 &
```

### 🔒 安全配置

#### 1. 环境变量
创建 `.env` 文件：
```env
PORT=3001
WEBHOOK_KEY=7a51bbe5-df79-4427-9937-44761e438c1d
ALLOWED_ORIGINS=http://test.wecomser.cloud:8080,https://test.wecomser.cloud
```

#### 2. 防火墙设置
```bash
# 开放3001端口
sudo ufw allow 3001
```

### 📊 监控和日志

#### 健康检查
```bash
curl http://test.wecomser.cloud:3001/health
```

#### 日志位置
- PM2日志: `~/.pm2/logs/`
- 直接运行: `webhook.log`

### 🧪 测试步骤

#### 1. 服务器测试
```bash
# 测试健康检查
curl http://localhost:3001/health

# 测试webhook代理
curl -X POST http://localhost:3001/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"msgtype":"text","text":{"content":"测试消息"}}'
```

#### 2. 前端测试
```javascript
// 在浏览器控制台运行
testWebhook().then(result => console.log(result));
```

### ⚠️ 常见问题

#### Q1: 代理服务器启动失败
```bash
# 检查端口是否被占用
lsof -i :3001

# 更改端口
PORT=3002 npm start
```

#### Q2: CORS错误仍然存在
- 检查前端URL配置是否正确
- 确认代理服务器CORS配置包含您的域名

#### Q3: 企业微信webhook key失效
- 进入企业微信群聊
- 重新生成机器人webhook地址
- 更新代理服务器中的WEBHOOK_URL

### 🎯 验证成功标志

✅ **代理服务器正常**:
```json
{
  "status": "ok", 
  "message": "Webhook代理服务器运行正常"
}
```

✅ **Webhook发送成功**:
```json
{
  "success": true,
  "message": "消息发送成功",
  "data": {"errcode": 0, "errmsg": "ok"}
}
```

✅ **前端提交成功**:
- 显示绿色成功提示
- 表单自动重置
- 控制台无错误信息

### 📞 备用方案

如果代理服务器方案不可行，还有以下选择：

1. **Serverless函数**: Vercel/Netlify Functions
2. **云函数**: 腾讯云SCF、阿里云FC
3. **API网关**: 使用云服务商的API网关转发

需要我帮您实现其中任何一种方案吗？
