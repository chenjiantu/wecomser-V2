# 🚀 Webhook代理服务器部署指南

## 🎯 问题诊断结果

✅ **代理服务器功能正常** - 本地测试完全成功  
❌ **外网访问被阻止** - 服务器只监听localhost

## 💡 解决方案选择

### 方案1：直接暴露Node.js服务器（快速）

#### 1. 重启服务器监听所有接口
```bash
# 停止现有服务
pm2 stop webhook-proxy

# 重新启动（代码已更新为监听0.0.0.0）
pm2 start webhook-proxy-server.js --name webhook-proxy
```

#### 2. 开放防火墙端口
```bash
# Ubuntu/Debian
sudo ufw allow 3001

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

#### 3. 测试外网访问
```bash
curl http://test.wecomser.cloud:3001/health
```

#### 4. 更新前端配置
在 `script.js` 中启用方案1：
```javascript
// 方案1: 直接访问Node.js服务器
return `${protocol}//${hostname}:3001/api/webhook`;
```

### 方案2：Nginx反向代理（推荐）

#### 1. 安装Nginx
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 2. 配置Nginx
```bash
# 复制配置文件
sudo cp nginx-webhook.conf /etc/nginx/sites-available/webhook
sudo ln -s /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/

# 或者添加到现有配置
sudo nano /etc/nginx/sites-available/default
```

#### 3. 测试和重启Nginx
```bash
# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

#### 4. 更新前端配置
在 `script.js` 中启用方案2：
```javascript
// 方案2: 通过Nginx反向代理
return `${protocol}//${hostname}/webhook/api/webhook`;
```

## 🔧 快速部署命令

### 选择方案1（直接暴露）
```bash
# 1. 停止现有服务
pm2 stop webhook-proxy

# 2. 重新启动
pm2 start webhook-proxy-server.js --name webhook-proxy

# 3. 开放端口
sudo ufw allow 3001

# 4. 测试
curl http://test.wecomser.cloud:3001/health
```

### 选择方案2（Nginx代理）
```bash
# 1. 安装Nginx
sudo apt install nginx

# 2. 配置Nginx（将nginx-webhook.conf内容添加到配置中）
sudo nano /etc/nginx/sites-available/default

# 3. 重启服务
sudo systemctl restart nginx
pm2 restart webhook-proxy

# 4. 测试
curl http://test.wecomser.cloud/webhook/health
```

## 🧪 验证部署

### 1. 服务器端验证
```bash
# 检查Node.js服务
pm2 status

# 检查端口监听
netstat -tlnp | grep 3001

# 检查Nginx（如果使用）
sudo systemctl status nginx
```

### 2. 网络连通性测试
```bash
# 直接访问测试
curl http://test.wecomser.cloud:3001/health

# Nginx代理测试
curl http://test.wecomser.cloud/webhook/health
```

### 3. 前端测试
在浏览器控制台运行：
```javascript
debugProxyServer()
```

## 📊 配置对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 直接暴露 | 简单快速 | 安全性较低 | 开发/测试环境 |
| Nginx代理 | 安全稳定 | 配置复杂 | 生产环境 |

## 🚨 安全建议

### 方案1安全加固
```bash
# 限制访问IP（可选）
sudo ufw allow from YOUR_IP_RANGE to any port 3001
```

### 方案2额外安全
```nginx
# 在Nginx配置中添加
location /webhook/ {
    # IP白名单
    allow YOUR_IP_RANGE;
    deny all;
    
    # 速率限制
    limit_req zone=webhook burst=10 nodelay;
    
    proxy_pass http://localhost:3001/;
}
```

## 🔍 故障排查

### 问题：外网仍无法访问
```bash
# 检查服务监听地址
netstat -tlnp | grep 3001
# 应该显示 0.0.0.0:3001 而不是 127.0.0.1:3001

# 检查防火墙
sudo ufw status
sudo iptables -L

# 检查云服务器安全组设置
```

### 问题：Nginx 502错误
```bash
# 检查Node.js服务是否运行
pm2 status

# 检查Nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

## ✅ 成功标志

部署成功后，您应该看到：

1. **服务器端**：
```bash
$ curl http://test.wecomser.cloud:3001/health
{"status":"ok","message":"Webhook代理服务器运行正常"}
```

2. **前端**：
```javascript
debugProxyServer()
// 应该显示所有测试通过
```

3. **表单提交**：
- 绿色成功提示
- 企业微信收到消息
- 无CORS错误

选择适合您环境的方案，按步骤执行即可解决外网访问问题！
