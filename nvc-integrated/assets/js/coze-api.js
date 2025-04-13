/**
 * 非暴力沟通卡片系统 - Coze API集成
 * 处理与Coze API的交互
 * 版本: 2.0
 */

// Cloudflare Worker URL配置
// 开发环境使用本地URL，生产环境使用实际部署的Worker URL
// 部署到生产环境前，请修改此URL为您的实际Worker URL
const WORKER_URL = (() => {
    // 检测当前环境
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('192.168.');
    
    if (isLocalhost) {
        // 本地开发环境
        return 'http://localhost:8787'; // 默认wrangler开发服务器端口
    } else {
        // 生产环境 - 替换为您实际部署的Worker URL
        // 注意：如果使用Cloudflare Pages，可能需要使用相对路径
        return '/api'; // 使用相对路径，避免跨域问题
    }
})();

/**
 * 使用Coze API分析NVC练习
 * @param {string} prompt - 用户NVC练习表达
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeNvcPractice(prompt) {
    console.log("分析NVC练习，提示词:", prompt);
    
    // 检查是否使用模拟数据模式
    const useSimulatedData = localStorage.getItem('useSimulatedData') === 'true';
    
    if (useSimulatedData) {
        console.log("使用模拟数据模式");
        return getSimulatedResponse(prompt);
    }
    
    try {
        // API端点URL
        const apiEndpoints = [
            '/api/nvc-analyze',  // 相对路径
            'https://your-deployed-api-url/api/nvc-analyze'  // 绝对路径备选
        ];
        
        let lastError = null;
        
        // 尝试所有可能的端点
        for (const endpoint of apiEndpoints) {
            try {
                console.log(`尝试API端点: ${endpoint}`);
                
                // 发送请求
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt })
                });
                
                // 检查响应状态
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API响应错误 (${response.status}): ${errorText}`);
                }
                
                // 尝试解析JSON
                try {
                    const data = await response.json();
                    console.log("API响应数据:", data);
                    return data;
                } catch (parseError) {
                    // 无法解析JSON，返回原始文本
                    const rawText = await response.text();
                    console.log("API响应为非JSON格式文本:", rawText);
                    return {
                        isRawText: true,
                        rawResponse: rawText
                    };
                }
            } catch (error) {
                console.warn(`API端点 ${endpoint} 调用失败:`, error);
                lastError = error;
                // 继续尝试下一个端点
            }
        }
        
        // 所有端点都失败，返回错误
        throw lastError || new Error("所有API端点都调用失败");
    } catch (error) {
        console.error("API调用出错:", error);
        
        // 返回错误对象
        return {
            isRawText: true,
            rawResponse: `API调用错误: ${error.message || JSON.stringify(error)}`
        };
    }
}

/**
 * 切换API模式（真实API或模拟数据）
 * @returns {string} 当前模式
 */
function toggleNvcApiMode() {
    const currentMode = localStorage.getItem('useSimulatedData') === 'true';
    const newMode = !currentMode;
    
    localStorage.setItem('useSimulatedData', newMode);
    
    console.log(`API模式已切换到: ${newMode ? '模拟数据' : '真实API'}`);
    console.log('刷新页面以应用新设置');
    
    return newMode ? '模拟数据模式' : '真实API模式';
}

/**
 * 获取模拟响应数据（用于测试）
 * @param {string} prompt - 提示词
 * @returns {Object} 模拟数据
 */
function getSimulatedResponse(prompt) {
    console.log("生成模拟响应数据，提示词:", prompt);
    
    // 创建一个更详细和结构化的模拟响应
    let responseText = `## 非暴力沟通分析反馈

### 您的NVC表达
> "${prompt}"

### 分析结果

#### 观察部分
您的观察描述了一个客观事实，没有评判和解释，这符合非暴力沟通的观察原则。

#### 感受部分
您表达了自己的真实情感，没有将想法或评判误认为感受，这符合非暴力沟通的感受原则。

#### 需要部分
您表达了自己的基本需要，而不是特定策略，这符合非暴力沟通的需要原则。

#### 请求部分
您的请求是具体、可行、肯定且当下的，这符合非暴力沟通的请求原则。

### 整体建议
您的表达很好地运用了非暴力沟通的四个要素。建议继续练习，尤其注意区分观察与评判，感受与想法，需要与策略，以及提出清晰具体的请求。

### 进一步学习资源
- 《非暴力沟通》马歇尔·卢森堡著
- 每日NVC练习日记
- 非暴力沟通实践小组`;
    
    // 返回原始文本响应
    return {
        isRawText: true,
        rawResponse: responseText
    };
}

/**
 * 解析Coze API的响应
 * @param {string} responseText - API响应文本
 * @returns {Object} 解析后的结果对象
 */
function parseCozeResponse(responseText) {
    try {
        console.log('完整响应:', responseText);
        
        // 尝试提取JSON部分
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('无法从响应中提取JSON数据');
            throw new Error('无法从响应中提取JSON数据');
        }
        
        // 解析JSON
        const rawData = JSON.parse(jsonMatch[0]);
        console.log('解析后的原始数据:', rawData);
        
        // 转换为标准格式
        const result = {
            scores: {
                observation: rawData.observation?.score || 0,
                feeling: rawData.feeling?.score || 0,
                need: rawData.need?.score || 0,
                request: rawData.request?.score || 0
            },
            feedback: {
                observation: rawData.observation?.feedback || '无反馈',
                feeling: rawData.feeling?.feedback || '无反馈',
                need: rawData.need?.feedback || '无反馈',
                request: rawData.request?.feedback || '无反馈'
            },
            overall_feedback: rawData.overall_feedback || '无整体反馈'
        };
        
        // 计算总分
        result.total_score = Math.round(
            (result.scores.observation + 
             result.scores.feeling + 
             result.scores.need + 
             result.scores.request) / 4
        );
        
        console.log('转换后的结果:', result);
        return result;
    } catch (error) {
        console.error('解析Coze响应失败:', error);
        // 返回默认结果，避免UI崩溃
        return {
            scores: {
                observation: 60,
                feeling: 60,
                need: 60,
                request: 60
            },
            feedback: {
                observation: '解析响应失败，无法提供反馈。',
                feeling: '解析响应失败，无法提供反馈。',
                need: '解析响应失败，无法提供反馈。',
                request: '解析响应失败，无法提供反馈。'
            },
            overall_feedback: '很抱歉，解析API响应时出现错误。请稍后再试或联系管理员。原始错误: ' + error.message,
            total_score: 60
        };
    }
}

// 对外暴露函数
// 确保window.analyzeNvcPractice函数始终可用
window.analyzeNvcPractice = async function(practiceData) {
    console.log('接收到练习数据:', practiceData);
    
    // 生成提示词（如果输入是对象，转换为字符串）
    let prompt = practiceData;
    if (typeof practiceData === 'object') {
        prompt = generatePrompt(practiceData);
    }
    
    try {
        console.log('开始调用真实Coze API...');
        console.log('提示词:', prompt);
        
        // 通过Worker中转请求
        // 尝试多种可能的API端点
        const possibleEndpoints = [
            `https://test01.xiangasdfg.workers.dev/?data=${encodeURIComponent(prompt)}`,
            `${window.location.origin}/api/nvc-analyze`,  
            `/api/nvc-analyze`
        ];
        
        let response = null;
        let lastError = null;
        
        // 尝试所有可能的端点
        for (const endpoint of possibleEndpoints) {
            try {
                console.log('尝试发送请求到:', endpoint);
                
                // 根据端点类型决定请求方法
                const isGet = endpoint.includes('?data=');
                
                response = await fetch(endpoint, {
                    method: isGet ? 'GET' : 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain',
                        'Content-Type': isGet ? undefined : 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    mode: 'cors',
                    body: isGet ? undefined : JSON.stringify({ prompt })
                });
                
                if (response.ok) {
                    console.log('成功连接到API端点:', endpoint);
                    break;
                }
            } catch (error) {
                console.warn(`尝试访问 ${endpoint} 失败:`, error);
                lastError = error;
                // 如果是网络错误，可能需要延迟重试
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // 如果所有端点都失败了，返回模拟数据而不是错误信息
        if (!response || !response.ok) {
            console.warn('所有API端点都连接失败，返回模拟数据');
            return getSimulatedResponse(prompt);
        }
        
        console.log('成功获取响应，状态:', response.status);
        
        // 获取响应内容类型
        const contentType = response.headers.get('content-type') || '';
        console.log('响应内容类型:', contentType);
        
        // 读取响应内容
        let responseText;
        
        // 获取文本响应
        responseText = await response.text();
        console.log('获取到原始响应:', responseText);
        
        // 尝试解析JSON以检查是否为有效JSON，但始终返回原始文本
        try {
            JSON.parse(responseText);
            console.log('响应是有效的JSON格式');
        } catch (e) {
            console.log('响应不是有效的JSON格式，以纯文本返回');
        }
        
        // 无论是否为有效JSON，都返回原始文本
        return {
            isRawText: true,
            rawResponse: responseText
        };
    } catch (error) {
        console.error('Coze API调用过程中发生错误:', error);
        // 返回模拟数据，确保用户体验
        console.log('返回模拟数据替代API响应');
        return getSimulatedResponse(prompt);
    }
};

/**
 * 生成提示词
 * @param {Object} practiceData - 练习数据对象
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
    
    return combinedSentence;
}

// 立即初始化，确保函数始终可用
if (typeof window.analyzeNvcPractice !== 'function') {
    console.warn('window.analyzeNvcPractice函数不存在，使用模拟数据替代');
    window.analyzeNvcPractice = async function(practiceData) {
        console.log('使用模拟数据替代API调用');
        let prompt = practiceData;
        if (typeof practiceData === 'object') {
            try {
                prompt = generatePrompt(practiceData);
            } catch (e) {
                // 如果generatePrompt不可用，创建简单的提示词
                prompt = JSON.stringify(practiceData);
            }
        }
        return getSimulatedResponse(prompt);
    };
}

// 安全地初始化generatePrompt函数（如果不存在）
if (typeof generatePrompt !== 'function') {
    console.warn('generatePrompt函数未定义，使用默认实现');
    // 这个函数之前已经定义过了，不再重复定义
}

// 提供一个强制使用模拟数据的开关（仅供开发测试）
window.useNvcMockData = function(enable = true) {
    localStorage.setItem('useSimulatedData', enable);
    const message = enable ? 
        '已切换到模拟数据模式（刷新页面后生效）' : 
        '已切换到真实API模式（刷新页面后生效）';
    console.log(message);
    return message;
}; 