const fetch = require('node-fetch');

// 测试配置
const PROXY_URL = 'http://localhost:3001/api/webhook';
const TEST_MESSAGE = {
    "msgtype": "text",
    "text": {
        "content": "【测试消息】\n这是来自代理服务器的测试消息\n时间：" + new Date().toLocaleString()
    }
};

async function testWebhookProxy() {
    console.log('🧪 开始测试Webhook代理服务器...\n');
    
    try {
        // 1. 测试健康检查
        console.log('1️⃣ 测试健康检查...');
        const healthResponse = await fetch('http://localhost:3001/health');
        const healthData = await healthResponse.json();
        
        if (healthResponse.ok) {
            console.log('✅ 健康检查通过:', healthData.message);
        } else {
            console.log('❌ 健康检查失败:', healthData);
            return;
        }
        
        // 2. 测试Webhook代理
        console.log('\n2️⃣ 测试Webhook代理...');
        const webhookResponse = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(TEST_MESSAGE)
        });
        
        const webhookData = await webhookResponse.json();
        
        if (webhookResponse.ok) {
            console.log('✅ Webhook代理测试成功!');
            console.log('📨 响应数据:', webhookData);
        } else {
            console.log('❌ Webhook代理测试失败:', webhookData);
        }
        
    } catch (error) {
        console.error('❌ 测试过程中发生错误:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 提示: 请确保代理服务器已启动');
            console.log('   运行命令: npm start');
        }
    }
}

// 运行测试
testWebhookProxy();
