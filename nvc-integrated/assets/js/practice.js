/**
 * practice.js - 非暴力沟通练习页面逻辑
 * 处理练习表单提交、API调用和结果展示
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPracticePage();
    
    // 初始化API调用函数
    initApiFunction();
    
    // 初始化调试功能
    initDebugFeatures();
});

/**
 * 初始化调试功能
 */
function initDebugFeatures() {
    const debugToggle = document.getElementById('debug-toggle');
    const debugSection = document.getElementById('debug-section');
    
    if (debugToggle && debugSection) {
        debugToggle.addEventListener('click', function() {
            if (debugSection.style.display === 'none' || debugSection.style.display === '') {
                debugSection.style.display = 'block';
                debugToggle.textContent = '隐藏调试信息';
            } else {
                debugSection.style.display = 'none';
                debugToggle.textContent = '显示调试信息';
            }
        });
    }
}

/**
 * 向调试日志添加一条消息
 * @param {string} message - 消息内容
 * @param {any} data - 可选的数据
 */
function logDebug(message, data) {
    const debugLog = document.getElementById('debug-log');
    if (!debugLog) return;
    
    const timestamp = new Date().toLocaleTimeString();
    let logEntry = document.createElement('div');
    
    if (typeof data === 'undefined') {
        logEntry.textContent = `[${timestamp}] ${message}`;
    } else {
        logEntry.textContent = `[${timestamp}] ${message}: ${typeof data === 'object' ? JSON.stringify(data) : data}`;
    }
    
    debugLog.appendChild(logEntry);
    debugLog.scrollTop = debugLog.scrollHeight;
}

/**
 * 显示原始响应数据
 * @param {string} data - 要显示的数据
 */
function showRawData(data) {
    const rawDataDiv = document.getElementById('raw-data');
    if (!rawDataDiv) return;
    
    rawDataDiv.textContent = data;
    rawDataDiv.style.display = 'block';
}

/**
 * 初始化练习页面
 */
function initPracticePage() {
    console.log('开始初始化练习页面');
    
    try {
        // 确保强制使用真实API模式
        localStorage.removeItem('useSimulatedData');
        localStorage.setItem('useSimulatedData', 'false');
        console.log('已强制设置为使用真实API模式');
        
        // 先初始化API调用函数
        initApiFunction();
    } catch (error) {
        console.error('设置API模式时出错:', error);
    }
    
    // 安全地获取DOM元素
    const practiceForm = document.getElementById('practiceForm');
    const aiResponseContainer = document.getElementById('aiResponseContainer');
    const newPracticeBtn = document.getElementById('newPracticeBtn');
    const savePracticeBtn = document.getElementById('savePracticeBtn');
    
    // 记录元素获取状态
    console.log('DOM元素获取状态:', {
        表单: !!practiceForm,
        结果容器: !!aiResponseContainer,
        新练习按钮: !!newPracticeBtn,
        保存按钮: !!savePracticeBtn
    });
    
    // 添加调试切换函数到window对象，方便开发者在控制台调试
    window.toggleApiMode = function(useMock = true) {
        try {
            // 使用localStorage实现模式切换
            localStorage.setItem('useSimulatedData', useMock);
            
            const message = `已切换到${useMock ? '模拟数据' : '真实API'}模式，刷新页面后生效`;
            console.log(message);
            return `当前API模式: ${useMock ? '模拟数据' : '真实API'}（刷新页面后生效）`;
        } catch (error) {
            console.error('切换API模式时出错:', error);
            return '切换API模式失败';
        }
    };
    
    // 安全地处理保存按钮
    if (savePracticeBtn) {
        try {
            // 如果用户未登录，禁用保存按钮
            if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
                savePracticeBtn.disabled = true;
                savePracticeBtn.title = '请先登录后再保存练习记录';
            }
        } catch (error) {
            console.error('设置保存按钮状态时出错:', error);
        }
    }
    
    // 尝试更新用户界面
    try {
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        } else {
            console.warn('updateAuthUI 函数不存在');
        }
    } catch (error) {
        console.error('更新用户界面时出错:', error);
    }
    
    // 安全地添加事件监听器
    if (practiceForm) {
        try {
            // 监听表单提交事件
            practiceForm.addEventListener('submit', function(event) {
                try {
                    handleSubmit(event);
                } catch (submitError) {
                    console.error('处理表单提交时出错:', submitError);
                    event.preventDefault();
                    alert('处理表单提交时出错: ' + submitError.message);
                }
            });
            console.log('已添加表单提交事件监听器');
        } catch (error) {
            console.error('添加表单事件监听器时出错:', error);
        }
    } else {
        console.error('无法找到练习表单元素，表单提交功能将不可用');
    }
    
    // 安全地添加新练习按钮事件
    if (newPracticeBtn && practiceForm && aiResponseContainer) {
        try {
            newPracticeBtn.addEventListener('click', function() {
                // 重置表单
                practiceForm.reset();
                
                // 隐藏结果，显示表单
                aiResponseContainer.classList.add('d-none');
                const formCard = practiceForm.closest('.card');
                if (formCard) {
                    formCard.classList.remove('d-none');
                } else {
                    practiceForm.classList.remove('d-none');
                }
            });
            console.log('已添加新练习按钮事件监听器');
        } catch (error) {
            console.error('添加新练习按钮事件监听器时出错:', error);
        }
    } else {
        console.warn('无法找到新练习按钮或相关元素，重置功能可能不可用');
    }
    
    // 安全地添加保存按钮事件
    if (savePracticeBtn) {
        try {
            savePracticeBtn.addEventListener('click', function() {
                try {
                    // 如果用户未登录，提示登录
                    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
                        if (typeof showAlert === 'function') {
                            showAlert('请先登录后再保存练习记录', 'warning');
                        } else {
                            alert('请先登录后再保存练习记录');
                        }
                        return;
                    }
                    
                    // 获取练习数据和反馈数据
                    const practiceData = typeof getPracticeFormData === 'function' ? 
                        getPracticeFormData() : {};
                    const feedbackData = typeof getCurrentFeedback === 'function' ? 
                        getCurrentFeedback() : {};
                    
                    // 检查反馈数据是否存在
                    if (!feedbackData || !feedbackData.rawResponse) {
                        if (typeof showAlert === 'function') {
                            showAlert('没有找到分析结果，请确保先完成练习分析', 'warning');
                        } else {
                            alert('没有找到分析结果，请确保先完成练习分析');
                        }
                        return;
                    }
                    
                    // 显示保存中状态
                    savePracticeBtn.disabled = true;
                    savePracticeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>保存中...';
                    
                    // 保存练习记录
                    if (typeof savePracticeRecord === 'function') {
                        savePracticeRecord(practiceData, feedbackData).then(() => {
                            if (typeof showAlert === 'function') {
                                showAlert('练习记录已保存', 'success');
                            } else {
                                alert('练习记录已保存');
                            }
                            savePracticeBtn.disabled = true;
                            savePracticeBtn.innerHTML = '<i class="fas fa-check me-2"></i>已保存';
                            
                            // 更新保存按钮样式
                            savePracticeBtn.classList.remove('btn-success');
                            savePracticeBtn.classList.add('btn-outline-success');
                        }).catch(error => {
                            console.error('保存错误:', error);
                            if (typeof showAlert === 'function') {
                                showAlert('保存失败，请稍后重试: ' + error.message, 'danger');
                            } else {
                                alert('保存失败，请稍后重试: ' + error.message);
                            }
                            
                            // 恢复按钮状态
                            savePracticeBtn.disabled = false;
                            savePracticeBtn.innerHTML = '<i class="fas fa-save me-2"></i>保存练习记录';
                        });
                    } else {
                        console.error('savePracticeRecord 函数不存在');
                        alert('保存功能不可用');
                        
                        // 恢复按钮状态
                        savePracticeBtn.disabled = false;
                        savePracticeBtn.innerHTML = '<i class="fas fa-save me-2"></i>保存练习记录';
                    }
                } catch (error) {
                    console.error('处理保存操作时出错:', error);
                    alert('保存过程中出错: ' + error.message);
                    
                    // 恢复按钮状态
                    savePracticeBtn.disabled = false;
                    savePracticeBtn.innerHTML = '<i class="fas fa-save me-2"></i>保存练习记录';
                }
            });
            console.log('已添加保存按钮事件监听器');
        } catch (error) {
            console.error('添加保存按钮事件监听器时出错:', error);
        }
    } else {
        console.warn('无法找到保存按钮，保存功能将不可用');
    }
    
    console.log('练习页面初始化完成');
}

/**
 * 获取表单数据
 * @returns {Object} 练习数据对象
 */
function getPracticeFormData() {
    return {
        observation: document.getElementById('observationInput').value.trim(),
        feeling: document.getElementById('feelingInput').value.trim(),
        need: document.getElementById('needInput').value.trim(),
        request: document.getElementById('requestInput').value.trim()
    };
}

/**
 * 验证表单数据
 * @param {Object} data - 练习数据对象
 * @returns {boolean} 验证结果
 */
function validatePracticeData(data) {
    // 检查是否所有字段都已填写
    if (!data.observation || !data.feeling || !data.need || !data.request) {
        showAlert('请填写所有字段', 'warning');
        return false;
    }
    
    // 移除严格的字段长度验证，只保留基本检查
    // 允许用户输入更简短的内容
    
    // 为空或只有空格的检查
    if (data.observation.length === 0 || data.feeling.length === 0 || 
        data.need.length === 0 || data.request.length === 0) {
        showAlert('请确保所有字段都有内容', 'warning');
        return false;
    }
    
    return true;
}

/**
 * 显示加载状态
 * @param {HTMLElement} container - 容器元素
 */
function showLoadingState(container) {
    // 先确认容器存在
    if (!container) {
        console.error('showLoadingState: 容器元素不存在');
        return;
    }
    
    try {
        // 检查是否已有加载容器
        let loadingContainer = document.getElementById('apiLoadingContainer');
        
        // 如果已存在，先移除它，以便重新创建
        if (loadingContainer) {
            try {
                loadingContainer.remove();
                console.log('移除旧的加载容器');
            } catch (error) {
                console.warn('移除旧加载容器失败:', error);
            }
        }
        
        console.log('创建新的加载容器');
        // 创建加载容器
        loadingContainer = document.createElement('div');
        loadingContainer.id = 'apiLoadingContainer';
        loadingContainer.className = 'api-loading-container p-4 my-4 text-center bg-light border rounded';
        
        // 创建标题
        const title = document.createElement('h4');
        title.className = 'mb-3 text-primary';
        title.innerHTML = '<i class="fas fa-robot me-2"></i>Coze AI正在分析您的NVC表达';
        
        // 创建加载动画
        const spinnerContainer = document.createElement('div');
        spinnerContainer.className = 'my-4';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner-border text-primary';
        spinner.style.width = '3rem';
        spinner.style.height = '3rem';
        spinner.setAttribute('role', 'status');
        
        spinnerContainer.appendChild(spinner);
        
        // 创建加载消息
        const message = document.createElement('p');
        message.id = 'apiLoadingMessage';
        message.className = 'lead mt-3';
        message.textContent = '正在连接Coze API服务，请稍候...';
        
        // 创建进度提示
        const hint = document.createElement('p');
        hint.className = 'text-muted mt-3';
        hint.textContent = '请稍等片刻，正在等待API响应';
        
        // 组装容器
        loadingContainer.appendChild(title);
        loadingContainer.appendChild(spinnerContainer);
        loadingContainer.appendChild(message);
        loadingContainer.appendChild(hint);
        
        // 安全地添加到结果容器
        const resultActions = document.getElementById('resultActions');
        
        if (resultActions && container.contains(resultActions)) {
            // 如果resultActions在当前容器中，在它前面插入
            try {
                container.insertBefore(loadingContainer, resultActions);
                console.log('在操作按钮前插入加载容器');
            } catch (insertError) {
                console.error('使用insertBefore插入失败:', insertError);
                // 备用方案：附加到容器末尾
                container.appendChild(loadingContainer);
                console.log('添加到容器末尾');
            }
        } else {
            // 直接添加到容器中
            container.appendChild(loadingContainer);
            console.log('添加到容器末尾');
        }
        
        console.log('加载容器创建完毕');
    } catch (error) {
        console.error('创建或显示加载状态时出错:', error);
        // 最后尝试：直接设置HTML内容
        try {
            const loadingHtml = `
                <div id="apiLoadingContainer" class="api-loading-container p-4 my-4 text-center bg-light border rounded">
                    <h4 class="mb-3 text-primary"><i class="fas fa-robot me-2"></i>Coze AI正在分析您的NVC表达</h4>
                    <div class="my-4">
                        <div class="spinner-border text-primary" style="width:3rem;height:3rem;" role="status"></div>
                    </div>
                    <p id="apiLoadingMessage" class="lead mt-3">正在连接Coze API服务，请稍候...</p>
                    <p class="text-muted mt-3">请稍等片刻，正在等待API响应</p>
                </div>
            `;
            
            // 找到安全的位置添加加载容器
            const firstChild = container.firstChild;
            if (firstChild) {
                // 在首个子元素前添加(使用innerHTML不会直接影响现有元素)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = loadingHtml;
                container.insertBefore(tempDiv.firstChild, firstChild);
            } else {
                // 容器为空，直接设置HTML
                container.innerHTML = loadingHtml;
            }
            console.log('使用HTML方式添加加载容器');
        } catch (fallbackError) {
            console.error('所有方法添加加载状态都失败:', fallbackError);
        }
    }
}

/**
 * 隐藏加载状态
 */
function hideLoadingState() {
    try {
        // 查找加载容器
        const loadingContainer = document.getElementById('apiLoadingContainer');
        
        // 添加日志以便排查
        console.log('尝试隐藏加载状态，容器存在:', !!loadingContainer);
        
        // 安全地移除容器
        if (loadingContainer) {
            try {
                // 尝试使用现代的remove方法
                loadingContainer.remove();
                console.log('成功移除加载容器');
            } catch (removeError) {
                console.error('使用remove方法移除加载容器时出错:', removeError);
                
                // 尝试使用parentNode.removeChild方法
                try {
                    if (loadingContainer.parentNode) {
                        loadingContainer.parentNode.removeChild(loadingContainer);
                        console.log('使用parentNode.removeChild成功移除加载容器');
                    } else {
                        console.error('加载容器没有父节点，无法移除');
                        // 隐藏而非移除
                        loadingContainer.style.display = 'none';
                        console.log('已将加载容器隐藏');
                    }
                } catch (secondError) {
                    console.error('使用parentNode.removeChild移除容器也失败:', secondError);
                    
                    // 最后尝试：修改样式隐藏
                    try {
                        loadingContainer.style.display = 'none';
                        console.log('已将加载容器隐藏');
                    } catch (styleError) {
                        console.error('隐藏加载容器也失败:', styleError);
                    }
                }
            }
        } else {
            console.warn('hideLoadingState: 找不到加载容器元素');
            
            // 尝试查找并移除所有可能的加载状态元素
            try {
                // 查找任何包含"loading"或"spinner"的元素
                const possibleLoaders = document.querySelectorAll('.api-loading-container, [id*="loading"], [id*="spinner"], .spinner-border');
                if (possibleLoaders.length > 0) {
                    console.log('找到其他可能的加载指示器:', possibleLoaders.length);
                    possibleLoaders.forEach(loader => {
                        try {
                            if (loader.parentNode) {
                                loader.parentNode.removeChild(loader);
                            } else {
                                loader.style.display = 'none';
                            }
                        } catch (e) {
                            // 忽略错误，继续处理下一个
                        }
                    });
                }
            } catch (fallbackError) {
                console.error('尝试移除可能的加载元素时出错:', fallbackError);
            }
        }
    } catch (error) {
        console.error('在hideLoadingState函数中捕获到意外错误:', error);
    }
}

/**
 * 分析练习数据
 * @param {Object} practiceData - 练习数据对象
 * @returns {Promise} 包含分析结果的Promise
 */
async function analyzePractice(practiceData) {
    // 设置分析状态
    updateAnalysisStatus('开始分析您的NVC练习内容...');
    
    try {
        // 使用环境自动选择的API函数（真实API或模拟API）
        updateAnalysisStatus('正在分析您的NVC表达...');
        const feedback = await window.analyzeNvcPractice(practiceData);
        updateAnalysisStatus('分析完成！');
        
        return feedback;
    } catch (error) {
        console.error('API调用错误:', error);
        updateAnalysisStatus('分析过程中出现错误: ' + error.message, true);
        throw error;
    }
}

/**
 * 更新分析状态提示
 * @param {string} message - 状态消息
 * @param {boolean} isError - 是否为错误消息
 */
function updateAnalysisStatus(message, isError = false) {
    // 查找或创建状态元素
    let statusElement = document.getElementById('analysisStatus');
    
    if (!statusElement) {
        // 创建状态元素
        statusElement = document.createElement('div');
        statusElement.id = 'analysisStatus';
        statusElement.className = 'alert alert-info my-3';
        
        // 创建加载图标
        const spinner = document.createElement('span');
        spinner.className = 'spinner-border spinner-border-sm me-2';
        spinner.setAttribute('role', 'status');
        
        // 创建消息容器
        const messageContainer = document.createElement('span');
        messageContainer.id = 'analysisStatusMessage';
        
        // 组装元素
        statusElement.appendChild(spinner);
        statusElement.appendChild(messageContainer);
        
        // 添加到表单下方
        const form = document.getElementById('practiceForm');
        form.appendChild(statusElement);
    }
    
    // 更新消息
    const messageContainer = document.getElementById('analysisStatusMessage');
    if (messageContainer) {
        messageContainer.textContent = message;
    }
    
    // 如果是错误，改变样式
    if (isError) {
        statusElement.className = 'alert alert-danger my-3';
    } else {
        statusElement.className = 'alert alert-info my-3';
    }
}

/**
 * 显示分析结果
 * @param {Object} practiceData - 练习数据对象
 * @param {Object} feedback - 分析反馈对象
 */
function displayResults(practiceData, feedback) {
    console.log('显示分析结果:', feedback);
    
    // 获取必要的DOM元素
    const scoreCharts = document.getElementById('scoreCharts');
    const feedbackDetails = document.getElementById('feedbackDetails');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!resultsContainer) {
        console.error('结果容器不存在，无法显示结果');
        alert('无法显示结果：页面元素缺失');
        return;
    }
    
    // 获取响应内容
    let responseText = '';
    let isRawText = feedback && feedback.isRawText;
    
    if (isRawText) {
        responseText = feedback.rawResponse;
        
        // 当显示原始文本时，隐藏分数和反馈卡片
        if (scoreCharts) scoreCharts.classList.add('d-none');
        if (feedbackDetails) feedbackDetails.classList.add('d-none');
    } else if (typeof feedback === 'string') {
        responseText = feedback;
        isRawText = true;
        
        // 当显示原始文本时，隐藏分数和反馈卡片
        if (scoreCharts) scoreCharts.classList.add('d-none');
        if (feedbackDetails) feedbackDetails.classList.add('d-none');
    } else {
        // 尝试转换对象为字符串并显示原始响应
        try {
            responseText = JSON.stringify(feedback, null, 2);
            isRawText = true;
            
            // 当显示原始文本时，隐藏分数和反馈卡片
            if (scoreCharts) scoreCharts.classList.add('d-none');
            if (feedbackDetails) feedbackDetails.classList.add('d-none');
        } catch (e) {
            responseText = '无法解析的响应内容';
            isRawText = true;
            
            // 当显示原始文本时，隐藏分数和反馈卡片
            if (scoreCharts) scoreCharts.classList.add('d-none');
            if (feedbackDetails) feedbackDetails.classList.add('d-none');
        }
    }

    try {
        // 安全地移除所有现有的内容（保留actions区域）
        const resultActions = document.getElementById('resultActions');
        
        // 清空结果容器中除了actions区域以外的所有内容
        const children = Array.from(resultsContainer.children);
        for (const child of children) {
            if (child.id !== 'resultActions' && child.id !== 'scoreCharts' && child.id !== 'feedbackDetails') {
                resultsContainer.removeChild(child);
            }
        }

        // 创建原始响应容器
        const rawResponseContainer = document.createElement('div');
        rawResponseContainer.id = 'rawResponseContainer';
        rawResponseContainer.className = 'raw-response-container p-4 my-4 bg-light border rounded';
        
        // 创建标题
        const title = document.createElement('h4');
        title.className = 'mb-3 text-primary';
        title.textContent = 'Coze响应';
        
        // 创建内容区域
        const content = document.createElement('pre');
        content.id = 'rawResponseContent';
        content.className = 'p-3 bg-white border rounded';
        content.style.maxHeight = '500px';
        content.style.overflow = 'auto';
        content.style.whiteSpace = 'pre-wrap';
        content.textContent = responseText || '无响应内容';
        
        // 组装容器
        rawResponseContainer.appendChild(title);
        rawResponseContainer.appendChild(content);
        
        // 安全地添加到结果容器
        // 查找安全的插入位置
        const firstElement = resultsContainer.firstElementChild;
        if (firstElement && firstElement.id === 'resultActions') {
            // 如果第一个元素是actions，在其前面插入
            resultsContainer.insertBefore(rawResponseContainer, firstElement);
        } else {
            // 直接添加到容器开头
            resultsContainer.prepend(rawResponseContainer);
        }
        
        console.log('成功显示原始API响应');
    } catch (error) {
        console.error('显示API响应时出错:', error);
        // 尝试使用更简单的方法
        try {
            // 清空整个容器并重建内容
            resultsContainer.innerHTML = '';
            
            const rawHtml = `
                <div id="rawResponseContainer" class="raw-response-container p-4 my-4 bg-light border rounded">
                    <h4 class="mb-3 text-primary">Coze响应</h4>
                    <pre id="rawResponseContent" class="p-3 bg-white border rounded" style="max-height:500px;overflow:auto;white-space:pre-wrap;">${responseText || '无响应内容'}</pre>
                </div>
                <div id="resultActions" class="text-center mt-4">
                    <button class="btn btn-outline-primary me-2" id="newPracticeBtn">
                        <i class="fas fa-pencil-alt me-2"></i>新的练习
                    </button>
                    <button class="btn btn-success" id="savePracticeBtn">
                        <i class="fas fa-save me-2"></i>保存练习记录
                    </button>
                </div>
            `;
            
            resultsContainer.innerHTML = rawHtml;
            
            // 重新添加按钮事件
            const newPracticeBtn = document.getElementById('newPracticeBtn');
            if (newPracticeBtn) {
                newPracticeBtn.addEventListener('click', function() {
                    const practiceForm = document.getElementById('practiceForm');
                    if (practiceForm) {
                        practiceForm.reset();
                        resultsContainer.classList.add('d-none');
                        const formCard = practiceForm.closest('.card');
                        if (formCard) {
                            formCard.classList.remove('d-none');
                        } else {
                            practiceForm.classList.remove('d-none');
                        }
                    }
                });
            }
            
            console.log('使用备用方法显示结果');
        } catch (fallbackError) {
            console.error('备用显示方法也失败:', fallbackError);
            alert('无法显示API响应结果: ' + error.message);
        }
    }
    
    // 保存当前反馈数据到全局变量
    window.currentFeedback = { 
        isRawText: true,
        rawResponse: responseText 
    };
}

/**
 * 获取当前反馈数据
 * @returns {Object} 当前反馈数据
 */
function getCurrentFeedback() {
    return window.currentFeedback || {};
}

/**
 * 动画显示得分圆环
 * @param {string} elementId - 圆环元素ID
 * @param {number} score - 得分值
 */
function animateScoreCircle(elementId, score) {
    const circle = document.getElementById(elementId);
    if (!circle) return;
    
    // 计算圆周长
    const radius = parseInt(circle.getAttribute('r'));
    const circumference = 2 * Math.PI * radius;
    
    // 设置初始偏移量（完全覆盖圆环）
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    
    // 计算新的偏移量
    const offset = circumference - (score / 100) * circumference;
    
    // 使用动画效果更新偏移量
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1s ease-in-out';
        circle.style.strokeDashoffset = offset;
    }, 100);
    
    // 根据得分更新颜色
    if (score < 50) {
        circle.style.stroke = '#FFC107'; // 黄色
    } else if (score < 80) {
        circle.style.stroke = '#42A5F5'; // 蓝色
    } else {
        circle.style.stroke = '#4CAF50'; // 绿色
    }
}

/**
 * 初始化API调用函数
 * 这个函数主要用于验证API调用函数的存在
 */
function initApiFunction() {
    console.log('初始化API调用函数...');
    
    try {
        // 强制设置为使用真实API
        localStorage.removeItem('useSimulatedData');
        localStorage.setItem('useSimulatedData', 'false');
        
        console.log('已设置为使用真实API模式');
        console.log('当前主机:', window.location.hostname);
        console.log('当前页面URL:', window.location.href);
        
        // 检查必要的API函数是否存在
        if (typeof window.analyzeNvcPractice !== 'function') {
            console.error('警告: analyzeNvcPractice 函数不存在，API调用将失败');
            alert('API调用函数未正确加载，请确保coze-api.js文件已正确加载。如问题持续，请刷新页面或联系管理员。');
        } else {
            console.log('analyzeNvcPractice 函数已存在并准备就绪');
        }
        
        console.log('API调用函数初始化完成');
    } catch (error) {
        console.error('初始化API调用函数时出错:', error);
        alert('初始化API调用函数时出错: ' + error.message);
    }
}

/**
 * 生成提交到API的提示词
 * @param {Object} practiceData - 练习数据
 * @returns {string} 格式化的提示词
 */
function generatePrompt(practiceData) {
    // 将所有NVC元素组合成一个完整的句子
    let combinedSentence = "";
    
    // 添加观察内容（如果有）
    if (practiceData.observation && practiceData.observation.trim()) {
        combinedSentence += `当我观察到${practiceData.observation}，`;
    }
    
    // 添加感受内容（如果有）
    if (practiceData.feeling && practiceData.feeling.trim()) {
        combinedSentence += `我感到${practiceData.feeling}，`;
    }
    
    // 添加需要内容（如果有）
    if (practiceData.need && practiceData.need.trim()) {
        combinedSentence += `因为我需要${practiceData.need}，`;
    }
    
    // 添加请求内容（如果有）
    if (practiceData.request && practiceData.request.trim()) {
        combinedSentence += `所以我想请求${practiceData.request}`;
    }
    
    // 如果句子末尾有逗号，替换为句号
    combinedSentence = combinedSentence.trim();
    if (combinedSentence.endsWith("，")) {
        combinedSentence = combinedSentence.slice(0, -1) + "。";
    } else if (!combinedSentence.endsWith("。")) {
        combinedSentence += "。";
    }
    
    console.log("生成的NVC句子: ", combinedSentence);
    
    // 返回组合后的句子作为提示词
    return combinedSentence;
}

/**
 * 处理表单提交事件
 * @param {Event} event - 提交事件对象
 */
async function handleSubmit(event) {
    event.preventDefault();
    console.log('提交NVC练习表单');
    logDebug('NVC练习表单提交开始');

    // 获取表单输入
    const observationInput = document.getElementById('observationInput');
    const feelingInput = document.getElementById('feelingInput');
    const needInput = document.getElementById('needInput');
    const requestInput = document.getElementById('requestInput');

    // 验证必要的输入字段是否存在
    if (!observationInput || !feelingInput || !needInput || !requestInput) {
        console.error('表单输入字段未找到');
        alert('页面元素加载不完整，请刷新页面后重试');
        logDebug('表单字段未找到', {observation: !!observationInput, feeling: !!feelingInput, need: !!needInput, request: !!requestInput});
        return;
    }

    // 获取表单数据
    const practiceData = {
        observation: observationInput.value.trim(),
        feeling: feelingInput.value.trim(),
        need: needInput.value.trim(),
        request: requestInput.value.trim()
    };

    // 验证表单数据（至少有一个字段不为空）
    if (!practiceData.observation && !practiceData.feeling && 
        !practiceData.need && !practiceData.request) {
        alert('请至少填写一项NVC元素');
        logDebug('表单验证失败：所有字段都为空');
        return;
    }

    console.log('表单数据:', practiceData);
    logDebug('表单数据已收集', practiceData);

    // 获取或创建AI响应容器
    let aiResponseContainer = document.getElementById('aiResponseContainer');
    if (!aiResponseContainer) {
        console.log('创建AI响应容器');
        aiResponseContainer = document.createElement('div');
        aiResponseContainer.id = 'aiResponseContainer';
        aiResponseContainer.className = 'card mt-4 shadow-sm';
        document.querySelector('.container').appendChild(aiResponseContainer);
        logDebug('已创建新的AI响应容器');
    } else {
        logDebug('使用现有的AI响应容器');
    }

    // 设置AI响应容器的内容
    aiResponseContainer.innerHTML = `
        <div class="card-header bg-primary text-white">
            <h5 class="mb-0">非暴力沟通教练反馈</h5>
        </div>
        <div class="card-body">
            <div id="nvcSummaryContent" class="mb-3">
                <h6>您的NVC表达:</h6>
                <p class="nvc-expression"></p>
            </div>
            <div id="statusDiv" class="alert alert-info">
                <i class="fas fa-spinner fa-spin"></i> 正在分析您的NVC表达...
            </div>
            <div id="responseContainer" class="markdown-body" style="display:none;"></div>
        </div>
    `;

    // 更新NVC表达式摘要
    updateNvcSummary(practiceData);

    // 获取状态和响应容器
    const statusDiv = document.getElementById('statusDiv');
    const responseContainer = document.getElementById('responseContainer');

    // 显示AI响应容器并隐藏表单卡片
    const formCard = document.querySelector('.card:not(#aiResponseContainer)');
    if (formCard) {
        formCard.style.display = 'none';
    }
    aiResponseContainer.style.display = 'block';
    logDebug('表单已隐藏，响应容器已显示');

    try {
        // 检查是否有window.analyzeNvcPractice函数
        if (typeof window.analyzeNvcPractice !== 'function') {
            console.error('analyzeNvcPractice函数未找到');
            logDebug('API函数不存在', {analyzeNvcPractice: typeof window.analyzeNvcPractice});
            throw new Error('API调用函数未找到，请刷新页面后重试');
        }

        console.log('调用API分析NVC练习');
        statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在分析您的NVC表达...';
        logDebug('开始调用API函数');

        // 调用API并获取结果
        const result = await window.analyzeNvcPractice(practiceData);
        console.log('API返回结果:', result);
        logDebug('API调用完成', {resultType: typeof result, isObject: result !== null && typeof result === 'object'});
        
        // 显示原始响应用于调试
        if (document.getElementById('debug-section')) {
            showRawData(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
            logDebug('原始响应数据已记录到调试区域');
        }

        // 处理API返回的结果
        statusDiv.style.display = 'none';
        responseContainer.style.display = 'block';
        
        if (result && result.isRawText) {
            // 如果是原始文本响应，使用Markdown渲染
            logDebug('处理原始文本响应');
            
            // 清理并渲染Markdown内容
            const cleanedText = typeof cleanKnowledgeBaseOutput === 'function' 
                ? cleanKnowledgeBaseOutput(result.rawResponse) 
                : result.rawResponse;
            
            // 使用marked.js渲染Markdown (确保页面已引入marked库)
            if (typeof marked !== 'undefined') {
                responseContainer.innerHTML = marked.parse(cleanedText);
                logDebug('使用marked渲染Markdown内容');
            } else {
                // 如果marked不可用，使用简单的文本替换实现基本格式
                const formattedText = cleanedText
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n\n/g, '<br><br>')
                    .replace(/\n/g, '<br>');
                responseContainer.innerHTML = formattedText;
                logDebug('使用基本格式化显示内容（marked库不可用）');
            }
        } else if (typeof result === 'string') {
            // 直接显示字符串响应
            logDebug('处理字符串响应');
            
            // 使用marked.js渲染Markdown (如果可用)
            if (typeof marked !== 'undefined') {
                responseContainer.innerHTML = marked.parse(result);
                logDebug('使用marked渲染字符串响应');
            } else {
                // 基本格式化
                const formattedText = result
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n\n/g, '<br><br>')
                    .replace(/\n/g, '<br>');
                responseContainer.innerHTML = formattedText;
                logDebug('使用基本格式化显示字符串响应');
            }
        } else if (result && typeof result === 'object') {
            // 处理结构化响应
            logDebug('处理结构化响应对象');
            
            // 尝试展示结构化数据
            if (result.scores && result.feedback) {
                // 标准的评分和反馈格式
                logDebug('使用标准的评分和反馈格式');
                let feedbackHtml = `
                    <h4>分析得分: ${result.total_score || 'N/A'}/100</h4>
                    <div class="feedback-section">
                        <h5>观察 (${result.scores.observation || 'N/A'}/100)</h5>
                        <p>${result.feedback.observation || '无反馈'}</p>
                    </div>
                    <div class="feedback-section">
                        <h5>感受 (${result.scores.feeling || 'N/A'}/100)</h5>
                        <p>${result.feedback.feeling || '无反馈'}</p>
                    </div>
                    <div class="feedback-section">
                        <h5>需要 (${result.scores.need || 'N/A'}/100)</h5>
                        <p>${result.feedback.need || '无反馈'}</p>
                    </div>
                    <div class="feedback-section">
                        <h5>请求 (${result.scores.request || 'N/A'}/100)</h5>
                        <p>${result.feedback.request || '无反馈'}</p>
                    </div>
                    <div class="feedback-section overall">
                        <h5>整体反馈</h5>
                        <p>${result.overall_feedback || '无整体反馈'}</p>
                    </div>
                `;
                responseContainer.innerHTML = feedbackHtml;
            } else if (result.content || result.message || result.text) {
                // 处理简单的文本响应格式
                logDebug('处理简单文本响应格式');
                const content = result.content || result.message || result.text || JSON.stringify(result);
                
                if (typeof marked !== 'undefined') {
                    responseContainer.innerHTML = marked.parse(content);
                } else {
                    responseContainer.innerHTML = `<p>${content}</p>`;
                }
            } else {
                // 未知结构，显示JSON
                logDebug('未知响应结构，显示JSON');
                responseContainer.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
            }
        } else {
            // 未知响应类型
            logDebug('未知响应类型', {resultType: typeof result});
            responseContainer.innerHTML = `<div class="alert alert-warning">
                <p>收到未知格式的响应。</p>
                <pre>${JSON.stringify(result, null, 2) || '无响应数据'}</pre>
            </div>`;
        }
        
        // 保存当前反馈数据以供后续使用
        window.currentFeedback = {
            isRawText: !!(result && result.isRawText),
            rawResponse: result && result.isRawText ? result.rawResponse : 
                         (typeof result === 'string' ? result : JSON.stringify(result))
        };
        logDebug('已保存当前反馈数据以供后续使用');
        
        // 添加操作按钮
        appendActionButtons(responseContainer);
        logDebug('已添加操作按钮');
        
    } catch (error) {
        console.error('分析NVC练习时发生错误:', error);
        logDebug('API调用或处理过程中出错', {error: error.message, stack: error.stack});
        statusDiv.innerHTML = `
            <div class="alert alert-danger">
                <strong>错误:</strong> ${error.message}
                <p>请稍后再试或联系管理员。</p>
                <p class="text-muted mt-2">错误详情: ${error.stack || '无详细信息'}</p>
            </div>
        `;
    }
}

/**
 * 更新NVC表达式摘要
 * @param {Object} practiceData - NVC练习数据
 */
function updateNvcSummary(practiceData) {
    const expressionElem = document.querySelector('#nvcSummaryContent .nvc-expression');
    if (!expressionElem) return;
    
    // 使用generatePrompt函数生成NVC表达式（如果可用）
    if (typeof generatePrompt === 'function') {
        expressionElem.textContent = generatePrompt(practiceData);
    } else {
        // 手动拼接NVC表达式
        let expression = '';
        if (practiceData.observation) expression += `当我观察到${practiceData.observation}，`;
        if (practiceData.feeling) expression += `我感到${practiceData.feeling}，`;
        if (practiceData.need) expression += `因为我需要${practiceData.need}，`;
        if (practiceData.request) expression += `所以我想请求${practiceData.request}`;
        
        // 清理末尾的逗号
        expression = expression.trim();
        if (expression.endsWith('，')) {
            expression = expression.slice(0, -1) + '。';
        } else if (!expression.endsWith('。')) {
            expression += '。';
        }
        
        expressionElem.textContent = expression;
    }
}

/**
 * 添加操作按钮
 * @param {HTMLElement} container - 要添加按钮的容器
 */
function appendActionButtons(container) {
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-4 d-flex justify-content-between';
    
    // 创建"重新练习"按钮
    const newPracticeBtn = document.createElement('button');
    newPracticeBtn.className = 'btn btn-primary';
    newPracticeBtn.innerHTML = '<i class="fas fa-redo"></i> 重新练习';
    newPracticeBtn.onclick = function() {
        // 显示表单卡片
        const formCard = document.querySelector('.card:not(#aiResponseContainer)');
        if (formCard) {
            formCard.style.display = 'block';
        }
        
        // 隐藏AI响应容器
        const aiResponseContainer = document.getElementById('aiResponseContainer');
        if (aiResponseContainer) {
            aiResponseContainer.style.display = 'none';
        }
        
        // 清空表单
        document.getElementById('observationInput').value = '';
        document.getElementById('feelingInput').value = '';
        document.getElementById('needInput').value = '';
        document.getElementById('requestInput').value = '';
    };
    
    // 创建"保存练习"按钮（仅当用户已登录时）
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-success';
    saveBtn.innerHTML = '<i class="fas fa-save"></i> 保存练习';
    saveBtn.onclick = function() {
        // 检查用户是否登录
        const isLoggedIn = !!localStorage.getItem('nvc_user_token');
        if (!isLoggedIn) {
            alert('请先登录才能保存练习');
            return;
        }
        
        // TODO: 实现保存练习的功能
        alert('保存练习功能即将上线，敬请期待！');
    };
    
    // 将按钮添加到容器
    buttonContainer.appendChild(newPracticeBtn);
    buttonContainer.appendChild(saveBtn);
    
    // 将按钮容器添加到响应容器
    container.appendChild(buttonContainer);
}

/**
 * 将文本渲染为Markdown
 * @param {string} text - 要渲染的文本
 * @returns {string} 渲染后的HTML
 */
function renderMarkdown(text) {
    try {
        return marked.parse(text);
    } catch (e) {
        console.error('Markdown渲染出错:', e);
        return text; // 如果渲染失败，返回原始文本
    }
}

/**
 * 切换提交按钮状态 - 健壮版
 * @param {boolean} isLoading - 是否正在加载
 */
function toggleSubmitState(isLoading) {
    try {
        console.log('尝试切换提交按钮状态:', isLoading ? '加载中' : '可用');
        
        // 尝试找到提交按钮
        const submitButton = document.getElementById('submitButton');
        if (!submitButton) {
            console.error('找不到ID为submitButton的提交按钮');
            
            // 尝试通过选择器找到按钮
            const altButton = document.querySelector('button[type="submit"]');
            if (!altButton) {
                console.error('找不到任何提交按钮，无法更改状态');
                return;
            }
            
            // 使用替代按钮
            console.log('使用备选提交按钮');
            try {
                altButton.disabled = !!isLoading;
                if (isLoading) {
                    altButton.setAttribute('data-original-text', altButton.textContent || '提交');
                    altButton.textContent = '处理中...';
                } else {
                    const originalText = altButton.getAttribute('data-original-text');
                    if (originalText) {
                        altButton.textContent = originalText;
                    }
                }
            } catch (buttonError) {
                console.error('修改备选按钮状态时出错:', buttonError);
            }
            return;
        }
        
        // 找到加载指示器
        const spinner = document.getElementById('submitSpinner');
        if (spinner) {
            try {
                if (isLoading) {
                    spinner.classList.remove('d-none');
                } else {
                    spinner.classList.add('d-none');
                }
            } catch (spinnerError) {
                console.error('修改加载指示器状态时出错:', spinnerError);
            }
        } else {
            console.warn('找不到加载指示器元素');
        }
        
        // 禁用/启用按钮
        try {
            submitButton.disabled = !!isLoading;
        } catch (disableError) {
            console.error('修改按钮disabled属性时出错:', disableError);
        }
        
        // 更新按钮文本
        try {
            // 找出所有的span元素
            const allSpans = submitButton.querySelectorAll('span');
            const textSpans = [];
            
            // 找出不是加载指示器的span元素
            for (let i = 0; i < allSpans.length; i++) {
                const span = allSpans[i];
                if (!span.id || span.id !== 'submitSpinner') {
                    textSpans.push(span);
                }
            }
            
            // 如果找到了文本span，就更新它的内容
            if (textSpans.length > 0) {
                for (let span of textSpans) {
                    try {
                        span.textContent = isLoading ? '处理中...' : '提交分析';
                    } catch (textError) {
                        console.error('更新span文本时出错:', textError);
                    }
                }
            } else {
                console.warn('找不到文本span元素');
                
                // 没有找到文本span，尝试直接设置按钮的文本
                try {
                    // 保存原始的HTML内容
                    if (isLoading) {
                        const spinnerHtml = spinner ? spinner.outerHTML : '';
                        submitButton.innerHTML = spinnerHtml + ' <span>处理中...</span>';
                    } else {
                        submitButton.innerHTML = '<span>提交分析</span>';
                    }
                } catch (htmlError) {
                    console.error('更新按钮HTML时出错:', htmlError);
                }
            }
        } catch (textUpdateError) {
            console.error('更新按钮文本时出错:', textUpdateError);
            
            // 最后尝试：直接设置整个按钮的textContent
            try {
                if (isLoading) {
                    submitButton.setAttribute('data-original-text', submitButton.textContent || '提交');
                    if (!spinner) {
                        submitButton.textContent = '处理中...';
                    }
                } else {
                    const originalText = submitButton.getAttribute('data-original-text');
                    if (originalText && !spinner) {
                        submitButton.textContent = originalText;
                    }
                }
            } catch (finalError) {
                console.error('最终尝试更新按钮文本时也失败:', finalError);
            }
        }
        
        console.log('提交按钮状态切换成功');
    } catch (error) {
        console.error('切换提交按钮状态时发生未预期的错误:', error);
    }
}

/**
 * 显示练习内容摘要
 * @param {Object} practiceData - 练习数据
 */
function showPracticeSummary(practiceData) {
    try {
        // 获取结果容器
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) {
            console.error('showPracticeSummary: 找不到结果容器');
            return;
        }
        
        // 检查是否已存在摘要容器
        let summaryContainer = document.getElementById('practiceSummary');
        
        // 如果已存在，则移除它，以便重新创建
        if (summaryContainer) {
            try {
                summaryContainer.remove();
            } catch (error) {
                console.warn('移除旧摘要容器失败:', error);
            }
        }
        
        // 创建新的摘要容器
        summaryContainer = document.createElement('div');
        summaryContainer.id = 'practiceSummary';
        summaryContainer.className = 'practice-summary card mb-4 border-primary';
        
        // 创建卡片头部
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header bg-primary text-white';
        cardHeader.innerHTML = '<h5 class="m-0">你的NVC表达</h5>';
        
        // 创建卡片体
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        cardBody.id = 'practiceSummaryContent';
        
        // 生成摘要内容
        const summarySentence = generatePrompt(practiceData);
        cardBody.innerHTML = `<p class="nvc-sentence">${summarySentence}</p>`;
        
        // 组装容器
        summaryContainer.appendChild(cardHeader);
        summaryContainer.appendChild(cardBody);
        
        // 安全地添加到结果容器的顶部
        // 使用prepend方法，避免使用insertBefore可能引起的问题
        resultsContainer.prepend(summaryContainer);
        
        console.log('成功显示练习摘要');
    } catch (error) {
        console.error('显示练习摘要时出错:', error);
    }
}

/**
 * 显示提示消息
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型 (success, info, warning, danger)
 */
function showToast(message, type = 'info') {
    // 创建Toast元素
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    // 创建Toast内容
    const toastContent = document.createElement('div');
    toastContent.className = 'd-flex';
    
    // 创建消息部分
    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', '关闭');
    
    // 组装Toast
    toastContent.appendChild(toastBody);
    toastContent.appendChild(closeButton);
    toastEl.appendChild(toastContent);
    
    // 添加到Toast容器
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        // 如果不存在Toast容器，创建一个
        const newToastContainer = document.createElement('div');
        newToastContainer.id = 'toastContainer';
        newToastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        newToastContainer.style.zIndex = '1050';
        document.body.appendChild(newToastContainer);
        newToastContainer.appendChild(toastEl);
    } else {
        toastContainer.appendChild(toastEl);
    }
    
    // 初始化Toast并显示
    const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
    toast.show();
    
    // 自动移除
    toastEl.addEventListener('hidden.bs.toast', function () {
        toastEl.remove();
    });
}

/**
 * 保存练习历史
 * @param {Object} practiceData - 练习数据
 * @param {Object} feedback - 反馈数据
 */
function savePracticeHistory(practiceData, feedback) {
    try {
        // 获取历史记录
        let practiceHistory = JSON.parse(localStorage.getItem('nvcPracticeHistory') || '[]');
        
        // 创建新记录
        const newRecord = {
            id: Date.now(),
            date: new Date().toISOString(),
            practice: practiceData,
            feedback: feedback.isRawText ? { rawResponse: feedback.rawResponse } : feedback,
            sentence: generatePrompt(practiceData)
        };
        
        // 添加到历史记录
        practiceHistory.unshift(newRecord);
        
        // 限制历史记录数量（最多保存50条）
        if (practiceHistory.length > 50) {
            practiceHistory = practiceHistory.slice(0, 50);
        }
        
        // 保存历史记录
        localStorage.setItem('nvcPracticeHistory', JSON.stringify(practiceHistory));
        console.log('练习历史已保存:', newRecord);
    } catch (error) {
        console.error('保存练习历史失败:', error);
    }
} 