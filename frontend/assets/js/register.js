/**
 * register.js - 非暴力沟通卡片系统注册页面逻辑
 * 处理用户注册界面交互
 * 版本: 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Register.js: 初始化注册页面');
    
    // 检查用户是否已登录
    if (isLoggedIn()) {
        // 已登录，重定向到首页
        console.log('Register.js: 用户已登录，重定向到首页');
        window.location.href = '../index.html';
        return;
    }
    
    // 设置表单提交处理
    setupRegisterForm();
    
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
 * 设置注册表单处理
 */
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Register.js: 处理注册表单提交');
            
            // 获取表单数据
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // 验证表单数据
            if (!username || !email || !password || !confirmPassword) {
                showError('请填写所有必填字段');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('两次输入的密码不一致');
                return;
            }
            
            if (password.length < 8) {
                showError('密码长度至少为8个字符');
                return;
            }
            
            if (!agreeTerms) {
                showError('请阅读并同意用户协议和隐私政策');
                return;
            }
            
            // 添加加载状态
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 注册中...';
            
            // 调用auth.js中的注册函数
            registerUser({ username, email, password })
                .then(user => {
                    console.log('Register.js: 注册成功', user);
                    // 注册成功，重定向到首页
                    window.location.href = '../index.html';
                })
                .catch(error => {
                    console.error('Register.js: 注册失败', error);
                    showError(error.message || '注册失败，请稍后再试');
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
    const registerError = document.getElementById('registerError');
    if (registerError) {
        registerError.textContent = message;
        registerError.classList.remove('d-none');
        
        // 添加动画效果
        registerError.classList.add('animated-alert');
        setTimeout(() => {
            registerError.classList.remove('animated-alert');
        }, 500);
        
        // 滚动到错误信息
        registerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * 设置密码可见性切换按钮
 */
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('registerPassword');
    
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
 * 注册新用户
 * @param {Object} userData - 用户注册数据
 * @returns {Promise} 注册结果Promise
 */
function registerUser(userData) {
    console.log('Register.js: 尝试注册新用户', userData.username);
    
    return new Promise((resolve, reject) => {
        // 获取已注册用户
        const existingUsers = JSON.parse(localStorage.getItem('nvcUsers') || '[]');
        
        // 检查用户名或邮箱是否已存在
        const userExists = existingUsers.some(user => 
            user.username === userData.username || user.email === userData.email
        );
        
        if (userExists) {
            reject(new Error('用户名或邮箱已被使用'));
            return;
        }
        
        // 创建新用户对象
        const newUser = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            password: userData.password, // 注意：实际应用中不应明文存储密码
            createdAt: new Date().toISOString(),
            bookmarks: [],
            bio: ''
        };
        
        // 保存新用户到用户列表
        existingUsers.push(newUser);
        localStorage.setItem('nvcUsers', JSON.stringify(existingUsers));
        
        // 存储登录状态（不包含密码）
        const userForStorage = { ...newUser };
        delete userForStorage.password;
        localStorage.setItem('nvcUser', JSON.stringify(userForStorage));
        
        // 模拟网络延迟
        setTimeout(() => {
            resolve(userForStorage);
        }, 1000);
    });
} 