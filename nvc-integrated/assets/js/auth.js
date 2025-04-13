/**
 * 非暴力沟通卡片系统 - 认证脚本文件
 * 处理用户注册、登录、登出和会话管理
 */

// 当DOM加载完成时初始化认证状态
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态并更新UI
    updateAuthUI();
});

/**
 * 检查用户是否已登录
 * @returns {boolean} 登录状态
 */
function isLoggedIn() {
    return Boolean(localStorage.getItem('nvcUser'));
}

/**
 * 获取当前登录的用户信息
 * @returns {Object|null} 用户信息对象或null
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('nvcUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * 根据登录状态更新UI显示
 */
function updateAuthUI() {
    const loginRegisterItem = document.getElementById('loginRegisterItem');
    const userProfileItem = document.getElementById('userProfileItem');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html');
    const isRegisterPage = currentPath.includes('register.html');
    
    if (isLoggedIn()) {
        // 用户已登录
        if (loginRegisterItem) loginRegisterItem.classList.add('d-none');
        if (userProfileItem) {
            userProfileItem.classList.remove('d-none');
            const user = getCurrentUser();
            if (usernameDisplay && user) {
                usernameDisplay.textContent = user.username;
            }
        }
        
        // 显示需要登录才能访问的功能
        const authRequiredElements = document.querySelectorAll('.auth-required');
        authRequiredElements.forEach(el => el.classList.remove('d-none'));
        
        // 如果当前在登录或注册页面，且不是登录过程中，则重定向到首页
        if ((isLoginPage || isRegisterPage) && !sessionStorage.getItem('loginSuccessful')) {
            console.log('Auth.js: 用户已登录，从登录/注册页面重定向到首页');
            
            // 获取重定向URL
            const redirectUrl = '../index.html';
            
            // 只有在页面完全加载后才执行重定向，避免与登录过程中的重定向冲突
            if (document.readyState === 'complete') {
                window.location.href = redirectUrl;
            } else {
                window.addEventListener('load', function() {
                    window.location.href = redirectUrl;
                });
            }
        }
    } else {
        // 用户未登录
        if (loginRegisterItem) loginRegisterItem.classList.remove('d-none');
        if (userProfileItem) userProfileItem.classList.add('d-none');
        
        // 隐藏需要登录才能访问的功能
        const authRequiredElements = document.querySelectorAll('.auth-required');
        authRequiredElements.forEach(el => el.classList.add('d-none'));
    }
    
    // 清除登录成功标记，避免影响其他页面
    if (!isLoginPage && !isRegisterPage) {
        sessionStorage.removeItem('loginSuccessful');
    }
}

/**
 * 处理用户注册
 * @param {Object} userData - 用户注册数据
 * @returns {Promise} 注册结果Promise
 */
function registerUser(userData) {
    // 在MVP阶段，我们使用localStorage模拟用户注册
    // 在实际项目中，这应该是一个API请求到后端服务器
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 检查用户名是否已存在
                const existingUsers = JSON.parse(localStorage.getItem('nvcUsers') || '[]');
                const userExists = existingUsers.some(user => user.username === userData.username || user.email === userData.email);
                
                if (userExists) {
                    reject(new Error('用户名或邮箱已被使用'));
                    return;
                }
                
                // 创建新用户（注意：密码应该在实际应用中通过后端进行加密）
                const newUser = {
                    id: Date.now().toString(),
                    username: userData.username,
                    email: userData.email,
                    password: userData.password, // 实际应用中不应明文存储密码
                    createdAt: new Date().toISOString()
                };
                
                // 保存新用户
                existingUsers.push(newUser);
                localStorage.setItem('nvcUsers', JSON.stringify(existingUsers));
                
                // 自动登录新注册的用户
                const userForStorage = { ...newUser };
                delete userForStorage.password; // 移除密码信息
                localStorage.setItem('nvcUser', JSON.stringify(userForStorage));
                
                resolve(userForStorage);
            } catch (error) {
                reject(error);
            }
        }, 1000); // 模拟网络延迟
    });
}

/**
 * 处理用户登录
 * @param {string} username - 用户名或邮箱
 * @param {string} password - 密码
 * @returns {Promise} 登录结果Promise
 */
function loginUser(username, password) {
    // 在MVP阶段，我们使用localStorage模拟用户登录
    // 在实际项目中，这应该是一个API请求到后端服务器
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 获取已注册用户
                const existingUsers = JSON.parse(localStorage.getItem('nvcUsers') || '[]');
                
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
                
                resolve(userForStorage);
            } catch (error) {
                reject(error);
            }
        }, 1000); // 模拟网络延迟
    });
}

/**
 * 用户登出
 */
function logoutUser() {
    // 清除登录状态
    localStorage.removeItem('nvcUser');
    
    // 更新UI
    updateAuthUI();
    
    // 重定向到首页
    window.location.href = '../index.html';
}

/**
 * 保存用户练习记录
 * @param {Object} practiceData - 练习内容数据
 * @param {Object} feedbackData - 反馈数据
 * @returns {Promise} 保存结果Promise
 */
function savePracticeRecord(practiceData, feedbackData) {
    // 检查用户是否登录
    if (!isLoggedIn()) {
        return Promise.reject(new Error('用户未登录'));
    }
    
    // 获取当前用户
    const currentUser = getCurrentUser();
    
    // 在MVP阶段，我们使用localStorage模拟保存练习记录
    // 在实际项目中，这应该是一个API请求到后端服务器
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 创建新的练习记录
                const newRecord = {
                    id: Date.now().toString(),
                    userId: currentUser.id,
                    observation: practiceData.observation,
                    feeling: practiceData.feeling,
                    need: practiceData.need,
                    request: practiceData.request,
                    scores: feedbackData.scores,
                    feedback: feedbackData.feedback,
                    overall_feedback: feedbackData.overall_feedback,
                    total_score: feedbackData.total_score,
                    createdAt: new Date().toISOString()
                };
                
                // 获取现有记录
                const existingRecords = JSON.parse(localStorage.getItem('nvcRecords') || '[]');
                
                // 添加新记录
                existingRecords.push(newRecord);
                localStorage.setItem('nvcRecords', JSON.stringify(existingRecords));
                
                resolve(newRecord);
            } catch (error) {
                reject(error);
            }
        }, 500); // 模拟网络延迟
    });
}

/**
 * 加载用户练习历史记录
 * @returns {Promise} 包含历史记录的Promise
 */
function loadPracticeHistory() {
    // 检查用户是否登录
    if (!isLoggedIn()) {
        return Promise.reject(new Error('用户未登录'));
    }
    
    // 获取当前用户
    const currentUser = getCurrentUser();
    
    // 在MVP阶段，我们使用localStorage模拟加载练习记录
    // 在实际项目中，这应该是一个API请求到后端服务器
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 获取所有记录
                const allRecords = JSON.parse(localStorage.getItem('nvcRecords') || '[]');
                
                // 筛选当前用户的记录
                const userRecords = allRecords.filter(record => record.userId === currentUser.id);
                
                // 按创建时间降序排序
                userRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                // 更新历史记录UI
                updateHistoryUI(userRecords);
                
                resolve(userRecords);
            } catch (error) {
                reject(error);
            }
        }, 500); // 模拟网络延迟
    });
}

/**
 * 更新历史记录页面UI
 * @param {Array} records - 用户练习记录数组
 */
function updateHistoryUI(records) {
    const historyList = document.querySelector('.history-list');
    if (!historyList) return;
    
    // 清空现有内容
    historyList.innerHTML = '';
    
    if (records.length === 0) {
        // 没有记录时显示提示
        historyList.innerHTML = `
            <div class="text-center py-5">
                <p class="text-muted">暂无练习记录</p>
                <a href="../pages/practice.html" class="btn btn-primary mt-3">开始练习</a>
            </div>
        `;
        return;
    }
    
    // 添加记录列表
    records.forEach(record => {
        const date = new Date(record.createdAt);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        const recordElement = document.createElement('div');
        recordElement.className = 'history-item';
        recordElement.innerHTML = `
            <div class="history-date">${formattedDate}</div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="history-content">
                    <p class="mb-1"><strong>观察：</strong>${truncateText(record.observation, 50)}</p>
                    <p class="mb-0"><em>总分：<span class="history-score">${record.total_score}</span>/100</em></p>
                </div>
                <button class="btn btn-sm btn-outline-primary" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#record-${record.id}" 
                    aria-expanded="false">
                    查看详情
                </button>
            </div>
            <div class="collapse mt-3" id="record-${record.id}">
                <div class="card card-body">
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <strong>观察：</strong> <span class="badge bg-primary">${record.scores.observation}</span>
                        </div>
                        <div class="col-md-9">
                            <p class="mb-0">${record.observation}</p>
                            <small class="text-muted">${record.feedback.observation}</small>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <strong>感受：</strong> <span class="badge bg-primary">${record.scores.feeling}</span>
                        </div>
                        <div class="col-md-9">
                            <p class="mb-0">${record.feeling}</p>
                            <small class="text-muted">${record.feedback.feeling}</small>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <strong>需要：</strong> <span class="badge bg-primary">${record.scores.need}</span>
                        </div>
                        <div class="col-md-9">
                            <p class="mb-0">${record.need}</p>
                            <small class="text-muted">${record.feedback.need}</small>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <strong>请求：</strong> <span class="badge bg-primary">${record.scores.request}</span>
                        </div>
                        <div class="col-md-9">
                            <p class="mb-0">${record.request}</p>
                            <small class="text-muted">${record.feedback.request}</small>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <strong>整体反馈：</strong>
                            <p class="mb-0 mt-1">${record.overall_feedback}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        historyList.appendChild(recordElement);
    });
    
    // 更新热力图
    updateHeatmap(records);
}

/**
 * 更新热力图
 * @param {Array} records - 用户练习记录数组
 */
function updateHeatmap(records) {
    const heatmapContainer = document.querySelector('.heatmap-container');
    if (!heatmapContainer) return;
    
    // 计算热力图数据
    // 这里使用一个简单的实现，显示过去90天的练习频率
    const days = 90;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 初始化日期映射
    const dateMap = {};
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dateMap[dateStr] = 0;
    }
    
    // 统计每天的练习次数
    records.forEach(record => {
        const dateStr = new Date(record.createdAt).toISOString().split('T')[0];
        if (dateMap[dateStr] !== undefined) {
            dateMap[dateStr]++;
        }
    });
    
    // 转换为数组，用于渲染
    const heatmapData = Object.entries(dateMap).map(([date, count]) => ({ date, count }));
    heatmapData.sort((a, b) => a.date.localeCompare(b.date));
    
    // 清空热力图容器
    heatmapContainer.innerHTML = '<h5 class="mb-3">练习频率热力图</h5><div class="heatmap"></div>';
    const heatmap = heatmapContainer.querySelector('.heatmap');
    
    // 渲染热力图
    heatmapData.forEach(item => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        
        // 根据练习次数设置颜色深浅
        if (item.count === 0) {
            cell.style.backgroundColor = '#ebedf0';
        } else if (item.count === 1) {
            cell.style.backgroundColor = '#c6e48b';
        } else if (item.count === 2) {
            cell.style.backgroundColor = '#7bc96f';
        } else if (item.count === 3) {
            cell.style.backgroundColor = '#239a3b';
        } else {
            cell.style.backgroundColor = '#196127';
        }
        
        // 设置提示信息
        cell.title = `${item.date}: ${item.count}次练习`;
        
        heatmap.appendChild(cell);
    });
}

/**
 * 截断文本到指定长度，并添加省略号
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
} 