/**
 * 非暴力沟通卡片系统 - 主要脚本文件
 * 包含网站通用功能和初始化代码
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('非暴力沟通卡片系统 - 页面已加载');
    
    // 初始化页面通用功能
    initPage();
    
    // 根据当前页面路径执行特定功能
    initPageSpecific();
});

/**
 * 初始化页面通用功能
 */
function initPage() {
    // 添加页面淡入效果
    document.body.classList.add('fade-in');
    
    // 设置导航栏活动链接
    setActiveNavLink();
    
    // 初始化页脚年份
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2025', new Date().getFullYear());
    }
}

/**
 * 根据当前URL设置活动导航链接
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // 首页特殊处理
        if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '') {
            if (href.endsWith('index.html')) {
                link.classList.add('active');
            }
        } 
        // 其他页面
        else if (href && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });
}

/**
 * 根据当前页面执行特定功能
 */
function initPageSpecific() {
    const currentPath = window.location.pathname;
    
    // 首页
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '') {
        // 首页特定功能
    }
    // 练习页面
    else if (currentPath.includes('practice.html')) {
        initPracticePage();
    }
    // 案例卡片页面
    else if (currentPath.includes('cases.html')) {
        initCasesPage();
    }
    // NVC要素页面
    else if (currentPath.includes('elements.html')) {
        initElementsPage();
    }
    // 练习历史页面
    else if (currentPath.includes('history.html')) {
        initHistoryPage();
    }
}

/**
 * 初始化练习页面功能
 */
function initPracticePage() {
    const practiceForm = document.getElementById('practiceForm');
    if (!practiceForm) return;
    
    practiceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const observation = document.getElementById('observation').value.trim();
        const feeling = document.getElementById('feeling').value.trim();
        const need = document.getElementById('need').value.trim();
        const request = document.getElementById('request').value.trim();
        
        // 简单验证
        if (!observation || !feeling || !need || !request) {
            showAlert('请填写所有字段', 'danger');
            return;
        }
        
        // 显示加载状态
        const submitBtn = practiceForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 分析中...';
        
        // 准备发送到Coze API的数据
        const practiceData = {
            observation: observation,
            feeling: feeling,
            need: need,
            request: request
        };
        
        // 调用Coze API (假设函数已实现)
        analyzeNvcPractice(practiceData)
            .then(response => {
                // 显示反馈结果
                displayFeedback(response);
                
                // 如果用户已登录，保存练习记录
                if (isLoggedIn()) {
                    savePracticeRecord(practiceData, response);
                }
            })
            .catch(error => {
                console.error('分析失败:', error);
                showAlert('分析出错，请稍后再试', 'danger');
            })
            .finally(() => {
                // 恢复按钮状态
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });
}

/**
 * 初始化案例卡片页面功能
 */
function initCasesPage() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 获取过滤类型
            const filterType = this.getAttribute('data-filter');
            
            // 过滤卡片
            filterCaseCards(filterType);
        });
    });
}

/**
 * 过滤案例卡片
 * @param {string} filterType - 过滤类型
 */
function filterCaseCards(filterType) {
    const caseCards = document.querySelectorAll('.case-card');
    
    caseCards.forEach(card => {
        if (filterType === 'all') {
            card.style.display = 'flex';
        } else {
            const cardType = card.getAttribute('data-type');
            card.style.display = (cardType === filterType) ? 'flex' : 'none';
        }
    });
}

/**
 * 初始化NVC要素页面功能
 */
function initElementsPage() {
    // 为元素卡片添加点击展开详情功能
    const elementCards = document.querySelectorAll('.element-card');
    
    elementCards.forEach(card => {
        card.addEventListener('click', function() {
            const details = this.querySelector('.element-details');
            if (details) {
                details.classList.toggle('d-none');
            }
        });
    });
}

/**
 * 初始化练习历史页面功能
 */
function initHistoryPage() {
    // 检查用户是否登录
    if (!isLoggedIn()) {
        // 显示登录提示
        const historyContainer = document.querySelector('.history-container');
        if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="text-center py-5">
                    <h3>需要登录</h3>
                    <p class="text-muted">请登录后查看您的练习历史记录</p>
                    <a href="login.html" class="btn btn-primary mt-3">登录</a>
                </div>
            `;
        }
        return;
    }
    
    // 如果用户已登录，加载历史记录
    loadPracticeHistory();
}

/**
 * 显示提示信息
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型 (success, danger, warning, info)
 */
function showAlert(message, type = 'info') {
    // 创建alert元素
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // 添加到页面
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // 5秒后自动关闭
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}

/**
 * 分析NVC练习 (Coze API集成)
 * @param {Object} practiceData - 练习数据
 * @returns {Promise} - API响应Promise
 */
function analyzeNvcPractice(practiceData) {
    // 在实际实现中，会通过API调用Coze
    // 这里提供一个基于Promise的模拟实现，便于开发测试
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 模拟API响应
            const mockResponse = {
                scores: {
                    observation: Math.floor(Math.random() * 40) + 60, // 60-100的随机数
                    feeling: Math.floor(Math.random() * 40) + 60,
                    need: Math.floor(Math.random() * 40) + 60,
                    request: Math.floor(Math.random() * 40) + 60
                },
                feedback: {
                    observation: "你的观察描述了事实，但还可以更加具体和客观，避免评判。",
                    feeling: "你很好地表达了自己的感受，可以尝试更精确地描述情绪状态。",
                    need: "你提到了自己的需要，可以更清晰地将其与感受关联起来。",
                    request: "你的请求比较明确，但可以更具体说明希望对方做什么。"
                },
                overall_feedback: "整体来看，你已经掌握了NVC的基本结构。继续练习将帮助你更自然地运用这些技巧。特别是在观察部分，可以更加关注客观事实而非主观评价。"
            };
            
            // 计算总分
            mockResponse.total_score = Math.round(
                (mockResponse.scores.observation + 
                 mockResponse.scores.feeling + 
                 mockResponse.scores.need + 
                 mockResponse.scores.request) / 4
            );
            
            resolve(mockResponse);
            
            // 模拟失败情况 (取消注释以测试)
            // reject(new Error('API请求失败'));
        }, 1500); // 模拟网络延迟
    });
}

/**
 * 显示练习反馈
 * @param {Object} feedback - 反馈数据
 */
function displayFeedback(feedback) {
    const feedbackSection = document.getElementById('feedbackSection');
    if (!feedbackSection) return;
    
    // 显示反馈区域
    feedbackSection.classList.remove('d-none');
    
    // 显示分数
    document.getElementById('totalScore').textContent = feedback.total_score;
    document.getElementById('observationScore').textContent = feedback.scores.observation;
    document.getElementById('feelingScore').textContent = feedback.scores.feeling;
    document.getElementById('needScore').textContent = feedback.scores.need;
    document.getElementById('requestScore').textContent = feedback.scores.request;
    
    // 显示反馈建议
    document.getElementById('observationFeedback').textContent = feedback.feedback.observation;
    document.getElementById('feelingFeedback').textContent = feedback.feedback.feeling;
    document.getElementById('needFeedback').textContent = feedback.feedback.need;
    document.getElementById('requestFeedback').textContent = feedback.feedback.request;
    document.getElementById('overallFeedback').textContent = feedback.overall_feedback;
    
    // 平滑滚动到反馈区域
    feedbackSection.scrollIntoView({ behavior: 'smooth' });
}

// 其他实用功能可以根据需要添加 