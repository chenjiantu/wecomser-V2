// DOM元素
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const consultForm = document.getElementById('consultForm');
const customerService = document.getElementById('customerService');
const contactConsult = document.getElementById('contactConsult');

// 移动端导航菜单切换
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 点击导航链接时关闭移动端菜单
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// 点击遮罩层关闭移动端菜单
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// 滚动时的导航栏效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
    
    // 显示/隐藏返回顶部按钮
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    // 滚动动画
    animateOnScroll();
});

// 返回顶部功能
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 案例轮播功能
let currentSlide = 0;
const slides = document.querySelectorAll('.case-card');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // 隐藏所有幻灯片
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // 显示当前幻灯片
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    showSlide(currentSlide);
}

function currentSlideFunc(index) {
    currentSlide = index - 1;
    showSlide(currentSlide);
}

// 将函数添加到全局作用域，以便HTML中的onclick可以访问
window.changeSlide = changeSlide;
window.currentSlide = currentSlideFunc;

// 自动轮播
setInterval(() => {
    changeSlide(1);
}, 5000);

// 滚动动画
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .case-card, .expertise-item, .contact-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in', 'visible');
        }
    });
}

// 平滑滚动到指定部分
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 为所有导航链接添加平滑滚动
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        smoothScrollTo(target);
    });
});

// 咨询表单提交处理
consultForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(consultForm);
    const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // 验证表单
    if (!data.name || !data.company || !data.phone || !data.service) {
        showMessage('请填写所有必填字段', 'error');
        return;
    }
    
    // 验证手机号
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
        showMessage('请输入有效的手机号码', 'error');
        return;
    }
    
    // 提交到webhook
    showMessage('正在提交咨询信息...', 'info');
    
    // 发送到企业微信webhook
    submitToWebhook(data);
});

// 消息提示功能
function showMessage(message, type = 'info') {
    // 移除现有的消息
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message-toast message-${type}`;
    messageElement.textContent = message;
    
    // 添加样式
    messageElement.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // 设置颜色
    switch (type) {
        case 'success':
            messageElement.style.background = '#07C160';
            break;
        case 'error':
            messageElement.style.background = '#e74c3c';
            break;
        case 'info':
            messageElement.style.background = '#3498db';
            break;
        default:
            messageElement.style.background = '#6c757d';
    }
    
    // 添加到页面
    document.body.appendChild(messageElement);
    
    // 显示动画
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 4000);
}

// 数字动画效果
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.textContent);
        const isPercentage = number.textContent.includes('%');
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            number.textContent = Math.floor(current) + (isPercentage ? '%' : '+');
        }, 20);
    });
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化动画
    animateOnScroll();
    
    // 延迟启动数字动画
    setTimeout(() => {
        animateNumbers();
    }, 1000);
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 鼠标跟随效果（可选）
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// 服务卡片悬停效果增强
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动性能
const optimizedScroll = debounce(() => {
    // 这里可以添加需要优化的滚动事件
}, 16);

window.addEventListener('scroll', optimizedScroll);

// 懒加载图片（如果有的话）
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 初始化懒加载
lazyLoadImages();

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // 空格键或回车键触发按钮点击
    if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('btn')) {
        e.preventDefault();
        e.target.click();
    }
});

// 浮窗功能
customerService.addEventListener('click', () => {
    window.open('https://work.weixin.qq.com/kfid/kfcffbc56183840b88f', '_blank');
});

contactConsult.addEventListener('click', () => {
    smoothScrollTo('#contact');
});

// Webhook配置
const WEBHOOK_CONFIG = {
    // 使用代理服务器URL，避免CORS问题
    url: (() => {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3001/api/webhook';  // 本地开发
        } else {
            // 生产环境 - 支持多种配置方式
            
            // 方案1: 直接访问Node.js服务器（需要服务器监听0.0.0.0）
            // return `${protocol}//${hostname}:3001/api/webhook`;
            
            // 方案2: 通过Nginx反向代理（推荐）
            return `${protocol}//${hostname}/webhook/api/webhook`;
            
            // 方案3: 使用CDN或负载均衡器
            // return `${protocol}//api.${hostname}/webhook`;
        }
    })(),
    directUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=7a51bbe5-df79-4427-9937-44761e438c1d', // 直连URL（备用）
    timeout: 10000, // 10秒超时
    retryCount: 2 // 重试次数
};

// 提交到企业微信webhook
async function submitToWebhook(data) {
    const webhookUrl = WEBHOOK_CONFIG.url;
    
    const message = {
        "msgtype": "text",
        "text": {
            "content": `【网站咨询】
姓名：${data.name}
公司：${data.company}
电话：${data.phone}
服务类型：${getServiceName(data.service)}
详细需求：${data.message || '无'}
时间：${new Date().toLocaleString()}`
        }
    };
    
    console.log('正在发送webhook请求:', message);
    
    // 带重试的webhook发送
    for (let attempt = 0; attempt <= WEBHOOK_CONFIG.retryCount; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.timeout);
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
                mode: 'cors',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            console.log(`Webhook响应状态 (尝试 ${attempt + 1}):`, response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Webhook响应数据:', result);
                
                // 检查代理服务器返回的结果
                if (result.success !== false) {
                    showMessage('咨询信息提交成功！我们会尽快联系您。', 'success');
                    consultForm.reset();
                    return; // 成功后直接返回
                } else {
                    throw new Error(result.message || '提交失败');
                }
            } else {
                let errorMessage = '未知错误';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    errorMessage = await response.text();
                }
                
                console.error('Webhook错误响应:', response.status, errorMessage);
                
                if (attempt === WEBHOOK_CONFIG.retryCount) {
                    throw new Error(`HTTP ${response.status}: ${errorMessage}`);
                }
                
                // 等待一段时间后重试
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        } catch (error) {
            console.error(`Webhook提交失败 (尝试 ${attempt + 1}):`, error);
            
            if (attempt === WEBHOOK_CONFIG.retryCount) {
                // 所有重试都失败了
                if (error.name === 'AbortError') {
                    showMessage('请求超时，网络连接可能有问题。请使用其他联系方式！', 'error');
                } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                    showMessage('网络连接失败，可能是CORS跨域问题。请使用其他联系方式！', 'error');
                } else {
                    showMessage(`提交失败: ${error.message}。请直接联系我们！`, 'error');
                }
                showFallbackContact();
                return;
            }
            
            // 等待一段时间后重试
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
    }
}

// 获取服务类型名称
function getServiceName(serviceValue) {
    const serviceMap = {
        'basic': '基础办公解决方案',
        'crm': '客户关系管理',
        'security': '数据安全保障',
        'ai': '智能化转型',
        'training': '专业培训服务',
        'custom': '定制化开发'
    };
    return serviceMap[serviceValue] || serviceValue;
}

// 显示备用联系方式
function showFallbackContact() {
    const fallbackModal = document.createElement('div');
    fallbackModal.className = 'fallback-modal';
    fallbackModal.innerHTML = `
        <div class="fallback-content">
            <div class="fallback-header">
                <h3>请直接联系我们</h3>
                <button class="close-fallback" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="fallback-body">
                <div class="contact-method">
                    <i class="fab fa-weixin"></i>
                    <div>
                        <strong>微信咨询</strong>
                        <p>646881507</p>
                    </div>
                </div>
                <div class="contact-method">
                    <i class="fas fa-phone"></i>
                    <div>
                        <strong>电话咨询</strong>
                        <p>18825080358</p>
                    </div>
                </div>
                <div class="contact-method">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <strong>邮箱咨询</strong>
                        <p>chen.jiantu@weiwise.cn</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加样式
    fallbackModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    `;
    
    const content = fallbackModal.querySelector('.fallback-content');
    content.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    const header = fallbackModal.querySelector('.fallback-header');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
    `;
    
    const closeBtn = fallbackModal.querySelector('.close-fallback');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const methods = fallbackModal.querySelectorAll('.contact-method');
    methods.forEach(method => {
        method.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 8px;
            background: #f8f9fa;
        `;
        
        const icon = method.querySelector('i');
        icon.style.cssText = `
            font-size: 20px;
            color: #07C160;
            margin-right: 15px;
            width: 25px;
        `;
    });
    
    document.body.appendChild(fallbackModal);
    
    // 点击背景关闭
    fallbackModal.addEventListener('click', (e) => {
        if (e.target === fallbackModal) {
            fallbackModal.remove();
        }
    });
}

// 测试webhook连接（开发调试用）
async function testWebhook() {
    const testMessage = {
        "msgtype": "text",
        "text": {
            "content": "【测试消息】\n这是一条webhook连接测试消息\n时间：" + new Date().toLocaleString()
        }
    };
    
    console.log('开始测试webhook连接...');
    console.log('使用URL:', WEBHOOK_CONFIG.url);
    
    try {
        const response = await fetch(WEBHOOK_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testMessage)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Webhook测试成功:', result);
            
            // 检查代理服务器的响应格式
            if (result.success !== false) {
                return { success: true, data: result };
            } else {
                return { success: false, error: result.message || '测试失败' };
            }
        } else {
            let errorMessage = '未知错误';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                errorMessage = await response.text();
            }
            
            console.error('❌ Webhook测试失败:', response.status, errorMessage);
            return { success: false, error: `HTTP ${response.status}: ${errorMessage}` };
        }
    } catch (error) {
        console.error('❌ Webhook测试异常:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            return { 
                success: false, 
                error: '无法连接到代理服务器，请确保代理服务器已启动' 
            };
        }
        
        return { success: false, error: error.message };
    }
}

// 调试函数 - 检查代理服务器状态
async function debugProxyServer() {
    console.log('🔍 开始调试代理服务器...');
    console.log('当前配置的URL:', WEBHOOK_CONFIG.url);
    
    try {
        // 1. 检查根路径
        console.log('\n1️⃣ 检查根路径...');
        const rootUrl = WEBHOOK_CONFIG.url.replace('/api/webhook', '');
        const rootResponse = await fetch(rootUrl);
        const rootData = await rootResponse.json();
        console.log('根路径响应:', rootData);
        
        // 2. 检查健康检查端点
        console.log('\n2️⃣ 检查健康检查端点...');
        const healthUrl = rootUrl + '/health';
        const healthResponse = await fetch(healthUrl);
        const healthData = await healthResponse.json();
        console.log('健康检查响应:', healthData);
        
        // 3. 检查webhook端点
        console.log('\n3️⃣ 检查webhook端点...');
        return await testWebhook();
        
    } catch (error) {
        console.error('❌ 调试过程中发生错误:', error);
        return { success: false, error: error.message };
    }
}

// 在控制台暴露函数
window.testWebhook = testWebhook;
window.debugProxyServer = debugProxyServer;

// 页面可见性API - 当页面变为可见时重新启动动画
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        animateOnScroll();
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
    // 可以在这里添加错误上报逻辑
});

// 性能监控
window.addEventListener('load', () => {
    // 页面加载完成后的性能统计
    const loadTime = performance.now();
    console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
    
    // 可以在这里添加性能上报逻辑
});
