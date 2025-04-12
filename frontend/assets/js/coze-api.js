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
    
    // 返回原始文本响应
    return {
        isRawText: true,
        rawResponse: `这是模拟的Coze API响应:\n\n您提交的NVC表达是:\n"${prompt}"\n\n这个表达使用了非暴力沟通的四个要素，很好地表达了您的观察、感受、需要和请求。\n\n建议：尝试使用更具体的观察而非评判，确保感受是真正的情绪而非想法，需要应该是普遍的人类需求而非特定策略，请求应该是具体、可行的行动。`
    };
}

/**
 * 调用Coze API进行NVC练习分析
 * 通过Cloudflare Worker中转请求，解决跨域问题
 * @param {Object} practiceData - 练习数据对象，包含observation, feeling, need, request属性
 * @returns {Promise} 包含分析结果的Promise
 */
async function callCozeApi(practiceData) {
    try {
        console.log('开始调用Coze API...');

        // 生成提示词，将四个NVC元素组合成一段文本
        const prompt = generatePrompt(practiceData);
        
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
                response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain',
                        'Cache-Control': 'no-cache'
                    },
                    mode: 'cors'
                });
                
                if (response.ok) {
                    console.log('成功连接到API端点:', endpoint);
                    break;
                }
            } catch (error) {
                console.warn(`尝试访问 ${endpoint} 失败:`, error);
                lastError = error;
            }
        }
        
        // 如果所有端点都失败了
        if (!response || !response.ok) {
            throw new Error(`无法连接到任何API端点: ${lastError?.message || '未知错误'}`);
        }
        
        // 确保响应体存在
        if (!response.body) {
            throw new Error('响应体为空');
        }
        
        // 读取流式响应
        const reader = response.body.getReader();
        let result = '';
        
        // 处理流式响应
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                break;
            }
            
            // 将二进制数据转换为文本
            const chunk = new TextDecoder().decode(value);
            result += chunk;
            
            // 输出接收到的数据，帮助调试
            console.log('收到数据块，长度:', chunk.length);
        }
        
        console.log('API响应完成，原始响应:', result);
        
        // 检查结果是否为空
        if (!result || result.trim() === '') {
            // 返回直接显示的错误消息
            return {
                isRawText: true,
                rawResponse: '从API接收到空响应，请检查服务器配置或稍后再试。',
                scores: { observation: 0, feeling: 0, need: 0, request: 0 },
                total_score: 0
            };
        }
        
        // 尝试解析响应，如果失败则直接返回原始响应
        try {
            return parseCozeResponse(result);
        } catch (parseError) {
            console.error('解析响应失败，返回原始文本:', parseError);
            return {
                isRawText: true,
                rawResponse: result,
                scores: { observation: 60, feeling: 60, need: 60, request: 60 },
                total_score: 60
            };
        }
    } catch (error) {
        console.error('Coze API调用过程中发生错误:', error);
        // 返回错误消息，而不是使用模拟数据
        return {
            isRawText: true,
            rawResponse: `API调用失败: ${error.message}\n\n请检查网络连接或Worker配置。`,
            scores: { observation: 0, feeling: 0, need: 0, request: 0 },
            total_score: 0
        };
    }
}

/**
 * 生成提示词
 * @param {Object} practiceData - 练习数据对象
 * @returns {string} 格式化的提示词
 */
function generatePrompt(practiceData) {
    // 简单组合四个NVC元素成一句话
    const combinedText = `我看到${practiceData.observation}，我感到${practiceData.feeling}，我需要${practiceData.need}，我希望${practiceData.request}`;

    return combinedText;
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
// 直接使用analyzeNvcPractice作为主函数，不再自动切换
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
        
        // 如果所有端点都失败了，返回错误信息
        if (!response || !response.ok) {
            console.error('所有API端点都连接失败，返回错误信息');
            return {
                isRawText: true,
                rawResponse: `无法连接到Coze API服务。\n\n错误信息: ${lastError?.message || '未知错误'}\n\n请检查网络连接并重试，或联系管理员。`
            };
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
        // 返回错误信息
        return {
            isRawText: true,
            rawResponse: `API调用失败: ${error.message || JSON.stringify(error)}\n\n请检查网络连接并重试。`
        };
    }
};

// 提供一个强制使用模拟数据的开关（仅供开发测试）
window.useNvcMockData = function(enable = true) {
    localStorage.setItem('useSimulatedData', enable);
    const message = enable ? 
        '已切换到模拟数据模式（刷新页面后生效）' : 
        '已切换到真实API模式（刷新页面后生效）';
    console.log(message);
    return message;
}; 