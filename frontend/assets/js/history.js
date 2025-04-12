/**
 * history.js - 练习历史页面逻辑
 * 处理练习历史记录的展示、热力图生成和详情查看
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initHistoryPage();
    
    // 如果需要生成测试数据，取消下面这行的注释
    // createTestData();
});

/**
 * 初始化历史页面
 */
function initHistoryPage() {
    // 获取DOM元素
    const loginPrompt = document.getElementById('loginPrompt');
    const noRecordsPrompt = document.getElementById('noRecordsPrompt');
    const historyContent = document.getElementById('historyContent');
    
    // 检查用户登录状态
    if (!isLoggedIn()) {
        // 未登录，显示登录提示
        loginPrompt.classList.remove('d-none');
        noRecordsPrompt.classList.add('d-none');
        historyContent.classList.add('d-none');
        
        // 更新导航栏
        updateAuthUI();
        return;
    }
    
    // 已登录，加载练习记录
    loadPracticeRecords();
    
    // 更新导航栏
    updateAuthUI();
    
    // 初始化日期筛选
    initDateFilters();
}

/**
 * 初始化日期筛选功能
 */
function initDateFilters() {
    // 检查日期筛选输入是否存在
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyFilterBtn = document.getElementById('applyFilter');
    const resetFilterBtn = document.getElementById('resetFilter');
    
    if (!startDateInput || !endDateInput) {
        console.log('日期筛选输入不存在，跳过初始化');
        return;
    }
    
    console.log('初始化日期筛选功能');
    
    // 设置默认日期范围：过去一个月
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    // 格式化日期为YYYY-MM-DD格式
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // 设置日期输入的默认值
    startDateInput.value = formatDate(oneMonthAgo);
    endDateInput.value = formatDate(today);
    
    // 应用筛选按钮点击事件
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            filterRecords();
        });
    }
    
    // 重置筛选按钮点击事件
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
}

/**
 * 根据日期筛选记录
 */
function filterRecords() {
    try {
        console.log('应用筛选条件');
        
        // 获取筛选条件
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const scoreFilterSelect = document.getElementById('scoreFilter');
        
        if (!startDateInput || !endDateInput || !scoreFilterSelect) {
            console.error('筛选输入元素不存在');
            return;
        }
        
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        const scoreFilter = scoreFilterSelect.value;
        
        // 如果设置了结束日期，将其设置为当天的末尾
        if (endDate) {
            endDate.setHours(23, 59, 59, 999);
        }
        
        console.log('筛选条件:', { 
            startDate: startDate ? startDate.toISOString() : null, 
            endDate: endDate ? endDate.toISOString() : null,
            scoreFilter 
        });
        
        // 获取当前用户ID
        const currentUser = getCurrentUser();
        if (!currentUser) {
            console.error('未找到当前用户信息');
            return;
        }
        
        // 获取所有记录
        let allRecords = [];
        try {
            const recordsJson = localStorage.getItem('nvcRecords');
            if (recordsJson) {
                allRecords = JSON.parse(recordsJson);
            }
        } catch (error) {
            console.error('获取练习记录失败:', error);
        }
        
        // 筛选当前用户的记录
        let userRecords = allRecords.filter(record => record.userId === currentUser.id);
        
        // 确保每条记录都有createdAt字段
        userRecords = userRecords.map(record => {
            if (!record.createdAt && record.created_at) {
                record.createdAt = record.created_at;
            }
            if (!record.createdAt) {
                record.createdAt = new Date().toISOString();
            }
            return record;
        });
        
        // 应用日期筛选
        if (startDate) {
            userRecords = userRecords.filter(record => {
                const recordDate = new Date(record.createdAt);
                return recordDate >= startDate;
            });
        }
        
        if (endDate) {
            userRecords = userRecords.filter(record => {
                const recordDate = new Date(record.createdAt);
                return recordDate <= endDate;
            });
        }
        
        // 应用分数筛选
        if (scoreFilter && scoreFilter !== 'all') {
            const [minScore, maxScore] = scoreFilter.split('-').map(Number);
            userRecords = userRecords.filter(record => {
                const totalScore = calculateTotalScore(record.scores);
                return totalScore >= minScore && totalScore <= maxScore;
            });
        }
        
        console.log(`筛选后记录数量: ${userRecords.length}`);
        
        // 更新记录列表
        updatePracticeRecordsList(userRecords);
        
        // 显示筛选后的记录数量
        const recordCount = document.getElementById('recordCount');
        if (recordCount) {
            recordCount.textContent = userRecords.length;
        }
        
        // 显示筛选状态
        showFilterStatus(true);
        
    } catch (error) {
        console.error('筛选记录失败:', error);
        alert('筛选记录失败，请重试。');
    }
}

/**
 * 重置筛选条件
 */
function resetFilters() {
    console.log('重置筛选条件');
    
    // 重置日期选择
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    // 格式化日期为YYYY-MM-DD格式
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // 重置日期输入的值
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput) startDateInput.value = formatDate(oneMonthAgo);
    if (endDateInput) endDateInput.value = formatDate(today);
    
    // 重置分数筛选
    const scoreFilterSelect = document.getElementById('scoreFilter');
    if (scoreFilterSelect) scoreFilterSelect.value = 'all';
    
    // 重新加载所有记录
    loadPracticeRecords();
    
    // 隐藏筛选状态
    showFilterStatus(false);
}

/**
 * 显示/隐藏筛选状态
 * @param {boolean} isFiltered - 是否已应用筛选
 */
function showFilterStatus(isFiltered) {
    const filterStatusElement = document.getElementById('filterStatus');
    if (!filterStatusElement) return;
    
    if (isFiltered) {
        filterStatusElement.classList.remove('d-none');
    } else {
        filterStatusElement.classList.add('d-none');
    }
}

/**
 * 加载练习记录
 */
function loadPracticeRecords() {
    // 获取DOM元素
    const loginPrompt = document.getElementById('loginPrompt');
    const noRecordsPrompt = document.getElementById('noRecordsPrompt');
    const historyContent = document.getElementById('historyContent');
    const practiceRecordsList = document.getElementById('practiceRecordsList');
    
    // 隐藏登录提示
    loginPrompt.classList.add('d-none');
    
    // 加载用户信息
    const currentUser = getCurrentUser();
    
    // 如果没有用户信息，显示登录提示
    if (!currentUser) {
        loginPrompt.classList.remove('d-none');
        noRecordsPrompt.classList.add('d-none');
        historyContent.classList.add('d-none');
        return;
    }
    
    console.log('加载用户历史记录:', currentUser.username);
    
    // 获取练习记录
    let records = [];
    try {
        // 从localStorage获取记录
        const recordsJson = localStorage.getItem('nvcRecords');
        if (recordsJson) {
            const allRecords = JSON.parse(recordsJson);
            // 筛选当前用户的记录
            records = allRecords.filter(record => record.userId === currentUser.id);
            console.log(`找到${records.length}条练习记录`);
        }
    } catch (error) {
        console.error('加载练习记录失败:', error);
    }
    
    // 更新记录计数
    const recordCount = document.getElementById('recordCount');
    if (recordCount) {
        recordCount.textContent = records.length;
    }
    
    // 检查是否有记录
    if (!records || records.length === 0) {
        // 没有记录，显示无记录提示
        noRecordsPrompt.classList.remove('d-none');
        historyContent.classList.add('d-none');
        
        // 添加测试数据按钮
        addCreateTestDataButton();
        return;
    }
    
    // 有记录，显示历史内容
    noRecordsPrompt.classList.add('d-none');
    historyContent.classList.remove('d-none');
    
    // 处理records中的创建时间
    records.forEach(record => {
        // 确保createdAt字段存在
        if (!record.createdAt && record.created_at) {
            record.createdAt = record.created_at;
        } else if (!record.createdAt && !record.created_at) {
            // 如果没有时间字段，设置为当前时间
            record.createdAt = new Date().toISOString();
        }
    });
    
    // 更新历史记录列表
    updatePracticeRecordsList(records);
    
    // 更新热力图
    updateHeatmap(records);
    
    // 如果有记录，移除测试数据按钮（如果存在）
    const testDataBtn = document.getElementById('create-test-data-btn');
    if (testDataBtn) {
        testDataBtn.remove();
    }
}

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户信息或null
 */
function getCurrentUser() {
    try {
        const userJson = localStorage.getItem('nvcUser');
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        return null;
    }
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
function isLoggedIn() {
    return Boolean(getCurrentUser());
}

/**
 * 更新练习记录列表
 * @param {Array} records - 练习记录数组
 */
function updatePracticeRecordsList(records) {
    const practiceRecordsList = document.getElementById('practiceRecordsList');
    
    // 清空列表
    practiceRecordsList.innerHTML = '';
    
    // 按日期排序（最新的排在前面）
    records.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at);
        const dateB = new Date(b.createdAt || b.created_at);
        return dateB - dateA;
    });
    
    // 添加记录到列表
    records.forEach((record, index) => {
        // 创建日期对象
        const date = new Date(record.createdAt || record.created_at);
        
        // 格式化日期
        const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        // 计算总分
        const totalScore = calculateTotalScore(record.scores);
        
        // 获取观察文本，并确保其存在
        const observation = record.observation || '无观察内容';
        
        // 截断观察文本
        const truncatedObservation = truncateText(observation, 50);
        
        // 创建列表项
        const listItem = document.createElement('div');
        listItem.className = 'list-group-item list-group-item-action';
        listItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${formattedDate}</h6>
                    <p class="mb-1 text-muted small">${truncatedObservation}</p>
                </div>
                <div class="text-end">
                    <span class="badge bg-${getScoreColor(totalScore)} rounded-pill fs-6">${totalScore}</span>
                    <button class="btn btn-sm btn-outline-primary ms-2 view-detail-btn" data-record-index="${index}">
                        查看详情
                    </button>
                </div>
            </div>
        `;
        
        // 添加到列表
        practiceRecordsList.appendChild(listItem);
    });
    
    // 添加查看详情事件
    addViewDetailEvents(records);
}

/**
 * 添加查看详情事件
 * @param {Array} records - 练习记录数组
 */
function addViewDetailEvents(records) {
    const viewDetailButtons = document.querySelectorAll('.view-detail-btn');
    
    viewDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recordIndex = parseInt(this.getAttribute('data-record-index'));
            const record = records[recordIndex];
            
            // 显示详情模态框
            showPracticeDetail(record);
        });
    });
}

/**
 * 显示练习详情
 * @param {Object} record - 练习记录对象
 */
function showPracticeDetail(record) {
    try {
        console.log('显示练习详情:', record);
        
        // 检查记录是否有效
        if (!record) {
            console.error('无效的练习记录');
            alert('无法显示记录详情，可能是数据格式不正确');
            return;
        }
        
        // 获取模态框元素
        const modalElement = document.getElementById('practiceDetailModal');
        if (!modalElement) {
            console.error('未找到模态框元素');
            return;
        }
        
        const modal = new bootstrap.Modal(modalElement);
        
        // 创建日期对象
        const date = new Date(record.createdAt || record.created_at);
        
        // 格式化日期
        const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        
        // 计算总分
        const scores = record.scores || {};
        const totalScore = calculateTotalScore(scores);
        
        // 更新模态框内容
        document.getElementById('modalPracticeDate').textContent = formattedDate;
        document.getElementById('modalPracticeTotalScore').textContent = totalScore;
        
        // 更新各要素得分
        document.getElementById('modalObservationScore').textContent = scores.observation || '-';
        document.getElementById('modalFeelingScore').textContent = scores.feeling || '-';
        document.getElementById('modalNeedScore').textContent = scores.need || '-';
        document.getElementById('modalRequestScore').textContent = scores.request || '-';
        
        // 更新各要素输入
        document.getElementById('modalObservationInput').textContent = record.observation || '无内容';
        document.getElementById('modalFeelingInput').textContent = record.feeling || '无内容';
        document.getElementById('modalNeedInput').textContent = record.need || '无内容';
        document.getElementById('modalRequestInput').textContent = record.request || '无内容';
        
        // 更新各要素反馈
        const feedback = record.feedback || {};
        document.getElementById('modalObservationFeedback').innerHTML = feedback.observation || '无反馈';
        document.getElementById('modalFeelingFeedback').innerHTML = feedback.feeling || '无反馈';
        document.getElementById('modalNeedFeedback').innerHTML = feedback.need || '无反馈';
        document.getElementById('modalRequestFeedback').innerHTML = feedback.request || '无反馈';
        
        // 更新整体建议
        document.getElementById('modalOverallFeedback').innerHTML = record.overall_feedback || '无整体建议';
        
        // 显示模态框
        modal.show();
    } catch (error) {
        console.error('显示练习详情时出错:', error);
        alert('显示详情时发生错误，请稍后再试');
    }
}

/**
 * 更新热力图
 * @param {Array} records - 练习记录数组
 */
function updateHeatmap(records) {
    const heatmapContainer = document.getElementById('practiceHeatmap');
    
    // 清空容器
    heatmapContainer.innerHTML = '';
    
    // 如果没有记录，显示提示
    if (!records || records.length === 0) {
        heatmapContainer.innerHTML = '<div class="text-center py-4">暂无练习记录</div>';
        return;
    }
    
    // 获取过去 12 个月的日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    
    // 创建月份标签
    const monthsContainer = document.createElement('div');
    monthsContainer.className = 'd-flex justify-content-between mb-2';
    
    // 获取月份名称
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    
    // 添加月份标签
    for (let i = 0; i < 12; i++) {
        const monthLabel = document.createElement('div');
        const monthIndex = (startDate.getMonth() + i) % 12;
        monthLabel.textContent = monthNames[monthIndex];
        monthLabel.className = 'text-muted small';
        monthLabel.style.width = 'calc(100% / 12)';
        monthLabel.style.textAlign = 'center';
        monthsContainer.appendChild(monthLabel);
    }
    
    heatmapContainer.appendChild(monthsContainer);
    
    // 创建热力图
    const heatmapGrid = document.createElement('div');
    heatmapGrid.className = 'd-flex flex-column';
    
    // 统计每天的练习次数
    const dailyPracticeCount = {};
    records.forEach(record => {
        // 确保record.created_at存在且格式正确
        if (record.created_at) {
            let dateStr;
            if (record.created_at.includes('T')) {
                dateStr = record.created_at.split('T')[0]; // 提取日期部分（YYYY-MM-DD）
            } else if (record.created_at.includes(' ')) {
                dateStr = record.created_at.split(' ')[0]; // 可能的其他格式
            } else {
                dateStr = record.created_at; // 假设已经是日期格式
            }
            dailyPracticeCount[dateStr] = (dailyPracticeCount[dateStr] || 0) + 1;
            console.log(`记录日期: ${dateStr}, 次数: ${dailyPracticeCount[dateStr]}`);
        }
    });
    
    // 获取最大练习次数（用于计算颜色深浅）
    const maxCount = Math.max(1, ...Object.values(dailyPracticeCount));
    console.log(`最大练习次数: ${maxCount}`);
    
    // 创建星期标签（周一到周日）
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    // 创建热力图行（每行代表一周的某一天）
    for (let day = 0; day < 7; day++) {
        const weekRow = document.createElement('div');
        weekRow.className = 'd-flex align-items-center mb-1';
        
        // 添加星期标签
        const dayLabel = document.createElement('div');
        dayLabel.textContent = weekDays[day];
        dayLabel.className = 'text-muted small me-2';
        dayLabel.style.width = '40px';
        weekRow.appendChild(dayLabel);
        
        // 创建一行的单元格
        const cellsContainer = document.createElement('div');
        cellsContainer.className = 'd-flex flex-grow-1';
        
        // 计算这一行需要多少列（周）
        const weeksCount = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
        
        // 遍历每一周
        for (let week = 0; week < weeksCount; week++) {
            // 计算当前单元格的日期
            const cellDate = new Date(startDate);
            cellDate.setDate(cellDate.getDate() + week * 7 + (day - cellDate.getDay() + 7) % 7);
            
            // 如果日期超出了结束日期，就跳过
            if (cellDate > endDate) continue;
            
            // 格式化日期字符串
            const cellDateStr = cellDate.toISOString().split('T')[0];
            
            // 获取当天的练习次数
            const count = dailyPracticeCount[cellDateStr] || 0;
            
            // 计算颜色深浅（0-1之间的值，用于设置opacity）
            const intensity = count === 0 ? 0 : 0.2 + (count / maxCount) * 0.8;
            
            // 创建单元格
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.style.width = '12px';
            cell.style.height = '12px';
            cell.style.margin = '1px';
            cell.style.backgroundColor = 'var(--primary-color)';
            cell.style.opacity = intensity;
            cell.style.borderRadius = '2px';
            
            // 添加提示文本
            cell.title = `${cellDate.getFullYear()}年${cellDate.getMonth() + 1}月${cellDate.getDate()}日: ${count}次练习`;
            
            // 添加到行
            cellsContainer.appendChild(cell);
        }
        
        weekRow.appendChild(cellsContainer);
        heatmapGrid.appendChild(weekRow);
    }
    
    heatmapContainer.appendChild(heatmapGrid);
    
    // 添加热力图相关样式（如果不存在）
    addHeatmapStyles();
}

/**
 * 添加热力图相关样式
 */
function addHeatmapStyles() {
    // 检查是否已存在热力图样式
    if (!document.getElementById('heatmap-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'heatmap-styles';
        styleElement.textContent = `
            .heatmap-container {
                padding: 1rem;
                overflow-x: auto;
            }
            .heatmap-cell {
                transition: transform 0.2s;
            }
            .heatmap-cell:hover {
                transform: scale(1.5);
            }
            .heatmap-legend-cell {
                width: 12px;
                height: 12px;
                background-color: var(--primary-color);
                border-radius: 2px;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

/**
 * 计算总分
 * @param {Object} scores - 分数对象
 * @returns {number} 总分
 */
function calculateTotalScore(scores) {
    // 如果scores不存在，返回0
    if (!scores) return 0;
    
    // 如果存在total_score，直接返回
    if (scores.total_score) return scores.total_score;
    
    // 否则计算各部分分数的平均值
    const scoreValues = [
        scores.observation || 0,
        scores.feeling || 0,
        scores.need || 0,
        scores.request || 0
    ];
    
    // 计算平均分
    const total = scoreValues.reduce((sum, score) => sum + score, 0);
    return Math.round(total / scoreValues.length);
}

/**
 * 截断文本
 * @param {string} text - 要截断的文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * 根据分数获取颜色
 * @param {number} score - 分数
 * @returns {string} 颜色类名
 */
function getScoreColor(score) {
    if (score >= 90) return 'success';
    if (score >= 75) return 'info';
    if (score >= 60) return 'warning';
    return 'danger';
}

/**
 * 创建测试数据
 * 仅用于开发测试，生产环境应该注释掉
 */
function createTestData() {
    console.log('创建测试数据...');
    
    // 检查是否已登录
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('未登录，无法创建测试数据');
        return;
    }
    
    // 获取现有记录
    let existingRecords = [];
    try {
        const recordsJson = localStorage.getItem('nvcRecords');
        if (recordsJson) {
            existingRecords = JSON.parse(recordsJson);
        }
    } catch (error) {
        console.error('获取现有记录失败:', error);
    }
    
    // 只保留不属于当前用户的记录
    const otherUsersRecords = existingRecords.filter(record => record.userId !== currentUser.id);
    
    // 创建新的测试记录
    const testRecords = [];
    
    // 创建过去一年的随机记录
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // 随机生成30-100条记录
    const recordCount = Math.floor(Math.random() * 70) + 30;
    console.log(`生成${recordCount}条测试记录...`);
    
    for (let i = 0; i < recordCount; i++) {
        // 创建随机日期
        const randomDate = new Date(oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime()));
        
        // 创建随机得分
        const scores = {
            observation: Math.floor(Math.random() * 40) + 60, // 60-100
            feeling: Math.floor(Math.random() * 40) + 60,
            need: Math.floor(Math.random() * 40) + 60,
            request: Math.floor(Math.random() * 40) + 60
        };
        
        // 计算总分
        const total = scores.observation + scores.feeling + scores.need + scores.request;
        scores.total_score = Math.round(total / 4);
        
        // 创建测试记录
        const testRecord = {
            id: `test-${Date.now()}-${i}`,
            userId: currentUser.id,
            observation: `这是第${i+1}条测试观察记录。当我看到...`,
            feeling: `这是第${i+1}条测试感受记录。我感到...`,
            need: `这是第${i+1}条测试需要记录。我需要...`,
            request: `这是第${i+1}条测试请求记录。我希望...`,
            scores: scores,
            feedback: {
                observation: `观察反馈：很好地描述了客观事实。`,
                feeling: `感受反馈：清晰地表达了你的感受。`,
                need: `需要反馈：有效地识别了你的需要。`,
                request: `请求反馈：明确而具体地提出了请求。`
            },
            overall_feedback: `整体来说，这是一个很好的NVC表达练习。你成功地应用了NVC的四个要素，特别是在观察部分，你避免了评判和解释。继续保持练习！`,
            createdAt: randomDate.toISOString()
        };
        
        testRecords.push(testRecord);
    }
    
    // 合并记录并保存
    const allRecords = [...otherUsersRecords, ...testRecords];
    localStorage.setItem('nvcRecords', JSON.stringify(allRecords));
    
    console.log(`测试数据创建完成，总共${allRecords.length}条记录，其中${testRecords.length}条为当前用户的测试记录`);
    
    // 刷新页面以显示新数据
    alert(`已为用户 ${currentUser.username} 创建${testRecords.length}条测试记录！刷新页面即可查看。`);
    window.location.reload();
}

/**
 * 添加创建测试数据按钮
 */
function addCreateTestDataButton() {
    // 检查按钮是否已存在
    const existingBtn = document.getElementById('create-test-data-btn');
    if (existingBtn) {
        return;
    }
    
    // 创建按钮
    const testDataBtn = document.createElement('button');
    testDataBtn.id = 'create-test-data-btn';
    testDataBtn.className = 'btn btn-warning btn-lg d-block mx-auto my-4';
    testDataBtn.innerHTML = '<i class="fas fa-magic me-2"></i> 创建测试数据';
    testDataBtn.style.maxWidth = '300px';
    testDataBtn.addEventListener('click', createTestData);
    
    // 找到放置按钮的容器
    const noRecordsPrompt = document.getElementById('noRecordsPrompt');
    if (noRecordsPrompt) {
        noRecordsPrompt.appendChild(testDataBtn);
    } else {
        // 备选位置 - 添加到页面主容器
        const mainContainer = document.querySelector('main .container');
        if (mainContainer) {
            mainContainer.appendChild(testDataBtn);
        }
    }
    
    console.log('已添加创建测试数据按钮');
} 