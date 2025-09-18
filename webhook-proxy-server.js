const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// 企业微信webhook配置
const WEBHOOK_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7a51bbe5-df79-4427-9937-44761e438c1d';

// 中间件
app.use(cors({
    origin: ['http://localhost:8080', 'http://test.wecomser.cloud:8080', 'https://test.wecomser.cloud'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// 健康检查端点
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Webhook代理服务器运行正常' });
});

// 根路径信息
app.get('/', (req, res) => {
    res.json({ 
        message: 'Webhook代理服务器',
        endpoints: {
            health: '/health',
            webhook: '/api/webhook'
        },
        version: '1.0.0'
    });
});

// Webhook代理端点
app.post('/api/webhook', async (req, res) => {
    try {
        console.log('收到webhook请求:', req.body);
        
        // 验证请求数据
        if (!req.body || !req.body.msgtype) {
            return res.status(400).json({ 
                error: '请求数据格式错误',
                message: '缺少必要的msgtype字段' 
            });
        }

        // 转发到企业微信
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
            timeout: 10000 // 10秒超时
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Webhook发送成功:', result);
            res.json({ 
                success: true, 
                message: '消息发送成功',
                data: result 
            });
        } else {
            console.error('❌ Webhook发送失败:', response.status, result);
            res.status(response.status).json({ 
                success: false, 
                error: '企业微信API错误',
                message: result.errmsg || '未知错误',
                code: result.errcode 
            });
        }
    } catch (error) {
        console.error('❌ 代理服务器错误:', error);
        
        if (error.name === 'AbortError') {
            res.status(408).json({ 
                success: false, 
                error: '请求超时',
                message: '企业微信服务器响应超时' 
            });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            res.status(503).json({ 
                success: false, 
                error: '网络连接失败',
                message: '无法连接到企业微信服务器' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: '服务器内部错误',
                message: error.message 
            });
        }
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ 
        success: false, 
        error: '服务器内部错误',
        message: err.message 
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: '接口不存在',
        message: '请检查请求路径' 
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Webhook代理服务器启动成功`);
    console.log(`📡 监听端口: ${PORT}`);
    console.log(`🌐 本地访问: http://localhost:${PORT}/health`);
    console.log(`🌍 外网访问: http://test.wecomser.cloud:${PORT}/health`);
    console.log(`📨 Webhook代理: http://test.wecomser.cloud:${PORT}/api/webhook`);
});

module.exports = app;
