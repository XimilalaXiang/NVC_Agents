/**
 * 非暴力沟通卡片系统 - 简化版认证脚本文件
 * 所有登录/注册功能已被移除，保留基本结构以避免引用错误
 */

// 当DOM加载完成时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 空函数，保留结构
});

/**
 * 检查用户是否已登录 - 始终返回true以禁用登录检查
 * @returns {boolean} 始终返回true
 */
function isLoggedIn() {
    return true;
}

/**
 * 获取当前登录的用户信息 - 返回空对象
 * @returns {Object} 空用户对象
 */
function getCurrentUser() {
    return { username: "本地用户" };
}

/**
 * 空函数，保留以避免引用错误
 */
function updateAuthUI() {
    // 空函数，不执行任何操作
}

/**
 * 保存用户练习记录（简化版）
 * 直接使用localStorage而不检查登录状态
 * @param {Object} practiceData - 练习内容数据
 * @param {Object} feedbackData - 反馈数据
 * @returns {Promise} 保存结果Promise
 */
function savePracticeRecord(practiceData, feedbackData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 创建新的练习记录
                const newRecord = {
                    id: Date.now().toString(),
                    userId: "local-user",
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
 * 加载用户练习历史记录（简化版）
 * 直接从localStorage加载历史记录而不检查登录状态
 * @returns {Promise} 包含历史记录的Promise
 */
function loadPracticeHistory() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 获取所有练习记录
                const allRecords = JSON.parse(localStorage.getItem('nvcRecords') || '[]');
                
                // 按创建时间降序排序
                allRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                resolve(allRecords);
            } catch (error) {
                reject(error);
            }
        }, 500); // 模拟网络延迟
    });
}

/**
 * 删除单条练习记录（简化版）
 * @param {string} recordId - 要删除的记录ID
 * @returns {Promise} 删除结果Promise
 */
function deletePracticeRecord(recordId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 获取现有记录
                const existingRecords = JSON.parse(localStorage.getItem('nvcRecords') || '[]');
                
                // 筛选出不匹配ID的记录
                const updatedRecords = existingRecords.filter(record => record.id !== recordId);
                
                // 保存更新后的记录
                localStorage.setItem('nvcRecords', JSON.stringify(updatedRecords));
                
                resolve({ success: true });
            } catch (error) {
                reject(error);
            }
        }, 500); // 模拟网络延迟
    });
}

/**
 * 获取用户统计数据（简化版）
 * @returns {Promise} 包含统计数据的Promise
 */
function getUserStats() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // 获取所有练习记录
                const allRecords = JSON.parse(localStorage.getItem('nvcRecords') || '[]');
                
                // 计算平均分
                let totalScore = 0;
                allRecords.forEach(record => {
                    totalScore += record.total_score;
                });
                
                const avgScore = allRecords.length > 0 ? totalScore / allRecords.length : 0;
                
                // 返回统计数据
                resolve({
                    totalPractices: allRecords.length,
                    avgScore: avgScore.toFixed(1),
                    lastPractice: allRecords.length > 0 ? allRecords[0].createdAt : null
                });
            } catch (error) {
                reject(error);
            }
        }, 500); // 模拟网络延迟
    });
}

// 保留其他可能被引用的空函数
function registerUser() { return Promise.reject(new Error('功能已禁用')); }
function loginUser() { return Promise.reject(new Error('功能已禁用')); }
function logoutUser() { console.log('登出功能已禁用'); } 