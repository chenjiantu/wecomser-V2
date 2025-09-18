# 🔧 Webhook "接口不存在" 问题排查

## 🚨 问题分析

您收到的错误 `{"success":false,"error":"接口不存在","message":"请检查请求路径"}` 表明：

✅ **好消息**: 代理服务器正在运行  
❌ **问题**: 请求路径不正确或代理服务器配置有问题

## 🔍 立即诊断步骤

### 1. 在浏览器控制台运行诊断
```javascript
debugProxyServer()
```

### 2. 检查当前配置的URL
```javascript
console.log('当前URL:', WEBHOOK_CONFIG.url);
```

### 3. 手动测试各个端点

#### 测试根路径
```javascript
fetch('http://test.wecomser.cloud:3001/')
  .then(r => r.json())
  .then(console.log);
```

#### 测试健康检查
```javascript
fetch('http://test.wecomser.cloud:3001/health')
  .then(r => r.json())
  .then(console.log);
```

#### 测试webhook端点
```javascript
fetch('http://test.wecomser.cloud:3001/api/webhook', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    "msgtype": "text",
    "text": {"content": "测试消息"}
  })
}).then(r => r.json()).then(console.log);
```

## 🛠️ 服务器端排查

### 1. 检查代理服务器状态
```bash
# 检查进程是否运行
ps aux | grep node

# 检查端口是否监听
netstat -tlnp | grep 3001
# 或
lsof -i :3001
```

### 2. 查看服务器日志
```bash
# 如果使用PM2
pm2 logs webhook-proxy

# 如果直接运行
tail -f webhook.log
```

### 3. 重启代理服务器
```bash
# 停止现有进程
pm2 stop webhook-proxy
# 或
pkill -f webhook-proxy-server.js

# 重新启动
npm start
```

### 4. 运行服务器端诊断
```bash
node debug-webhook.js
```

## 🔧 常见解决方案

### 方案1: URL配置问题
如果您的服务器不是在 `test.wecomser.cloud:3001`，请检查：

1. **服务器IP/域名是否正确**
2. **端口是否正确** 
3. **协议是否正确** (http/https)

### 方案2: 代理服务器未正确启动
```bash
# 确保在正确目录
cd /path/to/webhook-proxy

# 安装依赖
npm install

# 启动服务器
npm start
```

### 方案3: 防火墙问题
```bash
# 开放3001端口
sudo ufw allow 3001

# 或临时关闭防火墙测试
sudo ufw disable
```

### 方案4: CORS配置问题
检查 `webhook-proxy-server.js` 中的CORS配置：
```javascript
app.use(cors({
    origin: ['http://localhost:8080', 'http://test.wecomser.cloud:8080', 'https://test.wecomser.cloud'],
    // 添加您的实际域名
}));
```

## 🎯 快速修复建议

### 立即尝试的解决方案：

1. **重启代理服务器**
```bash
pm2 restart webhook-proxy
```

2. **检查端口占用**
```bash
lsof -ti:3001 | xargs kill -9
npm start
```

3. **更新前端URL配置**
如果您的服务器地址不同，请修改 `script.js` 中的URL：
```javascript
// 手动指定正确的代理服务器地址
const WEBHOOK_CONFIG = {
    url: 'http://YOUR_SERVER_IP:3001/api/webhook',
    // ...
};
```

## 📞 应急备用方案

如果代理服务器问题无法快速解决，可以临时使用：

### 方案A: 直接联系提示
修改表单提交处理，直接显示联系方式而不发送webhook

### 方案B: 邮件发送
使用邮件服务替代webhook（需要配置SMTP）

### 方案C: 第三方服务
使用formspree.io等第三方表单服务

## 📋 检查清单

- [ ] 代理服务器进程正在运行
- [ ] 端口3001可访问
- [ ] URL配置正确
- [ ] CORS配置包含您的域名
- [ ] 防火墙允许3001端口
- [ ] 企业微信webhook key有效

## 🆘 如果仍然无法解决

请提供以下信息：
1. `debugProxyServer()` 的完整输出
2. 服务器日志内容
3. 您的实际服务器地址和端口
4. `netstat -tlnp | grep 3001` 的输出

我将根据这些信息提供针对性的解决方案！
