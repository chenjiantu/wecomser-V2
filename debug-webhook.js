const fetch = require('node-fetch');

// 配置
const BASE_URL = 'http://test.wecomser.cloud:3001';
const LOCALHOST_URL = 'http://localhost:3001';

async function checkEndpoint(url, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        console.log(`\n🔍 检查: ${method} ${url}`);
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log(`   状态: ${response.status}`);
        console.log(`   响应:`, data);
        
        return { success: response.ok, status: response.status, data };
    } catch (error) {
        console.log(`   ❌ 错误: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function diagnoseWebhookProxy() {
    console.log('🚀 开始诊断Webhook代理服务器...\n');
    
    // 测试消息
    const testMessage = {
        "msgtype": "text",
        "text": {
            "content": "【诊断测试】\n这是一条诊断测试消息\n时间：" + new Date().toLocaleString()
        }
    };
    
    // 测试不同的URL
    const urls = [BASE_URL, LOCALHOST_URL];
    
    for (const baseUrl of urls) {
        console.log(`\n📡 测试服务器: ${baseUrl}`);
        console.log('=' .repeat(50));
        
        // 1. 根路径
        await checkEndpoint(baseUrl);
        
        // 2. 健康检查
        await checkEndpoint(`${baseUrl}/health`);
        
        // 3. Webhook端点
        await checkEndpoint(`${baseUrl}/api/webhook`, 'POST', testMessage);
        
        // 4. 错误路径测试
        await checkEndpoint(`${baseUrl}/nonexistent`);
    }
    
    console.log('\n🔧 排查建议:');
    console.log('1. 确保代理服务器已启动: npm start');
    console.log('2. 检查端口3001是否开放');
    console.log('3. 确认防火墙设置');
    console.log('4. 检查CORS配置是否包含您的域名');
    console.log('5. 查看服务器日志了解详细错误');
}

// 运行诊断
diagnoseWebhookProxy().catch(console.error);
