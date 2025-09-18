# 🔧 Webhook问题排查指南

## 问题描述
企业微信webhook无法正常接收表单提交的咨询信息。

## 🚨 可能的原因

### 1. CORS跨域问题 ⭐ **最可能的原因**
- **问题**：浏览器的同源策略阻止直接从前端调用企业微信API
- **表现**：控制台出现CORS错误，或者`Failed to fetch`错误
- **解决方案**：
  - 使用代理服务器转发请求
  - 部署后端API作为中介
  - 使用服务端渲染

### 2. Webhook Key失效
- **问题**：企业微信群聊机器人的webhook key已过期或被重置
- **表现**：HTTP 400/401错误
- **解决方案**：
  1. 进入企业微信群聊
  2. 点击群设置 → 群机器人
  3. 重新生成webhook地址
  4. 更新代码中的webhook URL

### 3. 网络连接问题
- **问题**：网络环境无法访问企业微信服务器
- **表现**：请求超时或网络错误
- **解决方案**：
  - 检查网络连接
  - 尝试使用VPN
  - 检查防火墙设置

### 4. 请求格式错误
- **问题**：发送的消息格式不符合企业微信API要求
- **表现**：HTTP 400错误
- **解决方案**：检查消息格式是否正确

## 🛠️ 已实施的修复

### 1. 增强错误处理
- 添加详细的错误日志输出
- 区分不同类型的错误（CORS、超时、网络等）
- 提供更友好的用户提示信息

### 2. 重试机制
- 自动重试失败的请求（最多重试2次）
- 指数退避策略（1秒、2秒间隔）
- 请求超时控制（10秒）

### 3. 备用联系方式
- Webhook失败时自动显示联系方式弹窗
- 包含微信、电话、邮箱等多种联系方式
- 确保用户能够通过其他方式联系

### 4. 调试工具
- 添加`testWebhook()`函数，可在控制台测试连接
- 详细的控制台日志输出
- 配置化的webhook设置

## 🔍 调试步骤

### 1. 打开浏览器开发者工具
按F12打开控制台，查看错误信息

### 2. 测试webhook连接
在控制台输入：
```javascript
testWebhook()
```

### 3. 查看错误类型
- **CORS错误**：`Access to fetch at 'https://qyapi.weixin.qq.com' from origin 'null' has been blocked by CORS policy`
- **网络错误**：`Failed to fetch` 或 `net::ERR_NETWORK_CHANGED`
- **超时错误**：`The operation was aborted`
- **API错误**：HTTP状态码400、401、500等

## 💡 推荐解决方案

### 方案1：使用代理服务器（推荐）
创建一个简单的后端API作为代理：

```javascript
// 后端代理示例（Node.js + Express）
app.post('/api/webhook', async (req, res) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 方案2：更新Webhook Key
1. 进入企业微信群聊
2. 群设置 → 群机器人 → 添加机器人
3. 选择"自定义机器人"
4. 复制新的webhook地址
5. 更新`WEBHOOK_CONFIG.url`

### 方案3：使用第三方服务
考虑使用以下服务作为中介：
- Vercel Functions
- Netlify Functions
- Cloudflare Workers

## 🔄 当前状态

✅ **已完成**：
- 错误处理增强
- 重试机制
- 备用联系方式
- 调试工具

⏳ **待验证**：
- Webhook Key是否有效
- 实际部署环境测试

## 📞 临时解决方案

如果webhook仍然无法工作，用户可以通过以下方式联系：

- **微信**：646881507
- **电话**：18825080358  
- **邮箱**：chen.jiantu@weiwise.cn

系统会在webhook失败时自动显示这些联系方式。
