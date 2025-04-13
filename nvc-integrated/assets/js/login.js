/**
 * login.js - 非暴力沟通卡片系统登录页面逻辑
 * 处理用户登录界面交互
 * 版本: 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login.js: 初始化登录页面');
    
    // 检查用户是否已登录
    if (isLoggedIn()) {
        // 已登录，重定向到首页
        console.log('Login.js: 用户已登录，重定向到首页');
        window.location.href = '../index.html';
        return;
    }
    
    // 设置表单提交处理
    setupLoginForm();
    
    // 设置密码可见性切换按钮
    setupPasswordToggle();
});

/**
 * 检查用户是否已登录
 * @returns {boolean} 登录状态
 */
function isLoggedIn() {
    return localStorage.getItem('nvcUser') ? true : false;
}

/**
 * 设置登录表单处理
 */
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login.js: 处理登录表单提交');
            
            // 获取表单数据
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            // 验证表单数据
            if (!username || !password) {
                showError('请填写用户名和密码');
                return;
            }
            
            // 添加加载状态
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 登录中...';
            
            // 调用auth.js中的登录函数
            loginUser(username, password)
                .then(user => {
                    console.log('Login.js: 登录成功', user);
                    
                    // 标记登录成功，阻止其他重定向
                    sessionStorage.setItem('loginSuccessful', 'true');
                    
                    // 从URL或会话存储中获取回调URL
                    const urlParams = new URLSearchParams(window.location.search);
                    let callback = urlParams.get('callback');
                    
                    // 如果URL中没有回调参数，则尝试从会话存储中获取
                    if (!callback) {
                        callback = sessionStorage.getItem('loginCallback');
                        sessionStorage.removeItem('loginCallback'); // 用完即删
                    }
                    
                    // 如果找到有效的回调URL，则跳转到回调URL
                    if (callback) {
                        console.log('Login.js: 跳转到回调URL:', callback);
                        
                        // 确保回调URL是相对路径或同域名
                        if (callback.startsWith('/') || callback.startsWith('../') || 
                            callback.startsWith('./') || callback.includes(window.location.hostname)) {
                            window.location.href = callback;
                            return;
                        }
                    }
                    
                    // 没有回调URL或回调URL无效，跳转到首页
                    window.location.href = '../index.html';
                })
                .catch(error => {
                    console.error('Login.js: 登录失败', error);
                    showError(error.message || '登录失败，请检查用户名和密码');
                })
                .finally(() => {
                    // 恢复按钮状态
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
        });
    }
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 */
function showError(message) {
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.remove('d-none');
        
        // 添加动画效果
        loginError.classList.add('animated-alert');
        setTimeout(() => {
            loginError.classList.remove('animated-alert');
        }, 500);
    }
}

/**
 * 设置密码可见性切换按钮
 */
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');
    
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // 更新图标
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

/**
 * 登录用户
 * @param {string} username - 用户名或邮箱
 * @param {string} password - 密码
 * @returns {Promise} 登录结果Promise
 */
function loginUser(username, password) {
    console.log('Login.js: 尝试登录用户', username);
    
    return new Promise((resolve, reject) => {
        // 获取已注册用户
        const existingUsers = JSON.parse(localStorage.getItem('nvcUsers') || '[]');
        
        // 尝试查找匹配的用户作为演示账号
        if (username === 'demo' && password === 'password') {
            // 创建演示用户
            const demoUser = {
                id: 'demo-' + Date.now(),
                username: 'demo',
                email: 'demo@example.com',
                isDemo: true,
                createdAt: new Date().toISOString()
            };
            
            // 存储演示用户登录状态
            localStorage.setItem('nvcUser', JSON.stringify(demoUser));
            
            // 模拟网络延迟
            setTimeout(() => {
                resolve(demoUser);
            }, 1000);
            
            return;
        }
        
        // 查找匹配的用户
        const user = existingUsers.find(user => 
            (user.username === username || user.email === username) && 
            user.password === password
        );
        
        if (!user) {
            reject(new Error('用户名或密码不正确'));
            return;
        }
        
        // 存储登录状态
        const userForStorage = { ...user };
        delete userForStorage.password; // 移除密码信息
        localStorage.setItem('nvcUser', JSON.stringify(userForStorage));
        
        // 模拟网络延迟
        setTimeout(() => {
            resolve(userForStorage);
        }, 1000);
    });
} 