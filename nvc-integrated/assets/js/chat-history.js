/**
 * chat-history.js - 非暴力沟通卡片系统聊天历史记录管理
 * 负责保存、加载和管理用户与AI助手的对话历史
 */

// 当页面加载完成时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chat History JS 已加载');
});

/**
 * 保存对话到本地存储
 * @param {string} userMessage - 用户的消息
 * @param {string} aiResponse - AI的回复
 * @param {string} botType - 机器人类型
 * @returns {boolean} 是否保存成功
 */
function saveDialogue(userMessage, aiResponse, botType) {
    try {
        if (!userMessage || !aiResponse) {
            console.error('无法保存空对话');
            return false;
        }
        
        // 创建对话记录对象
        const dialogue = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            userMessage: userMessage,
            aiResponse: aiResponse,
            botType: botType || '未知'
        };
        
        // 从本地存储获取现有对话历史
        let chatHistory = JSON.parse(localStorage.getItem('nvcChatHistory') || '[]');
        
        // 添加新对话
        chatHistory.push(dialogue);
        
        // 限制历史记录数量，保留最新的100条
        if (chatHistory.length > 100) {
            chatHistory = chatHistory.slice(-100);
        }
        
        // 保存到本地存储
        localStorage.setItem('nvcChatHistory', JSON.stringify(chatHistory));
        
        console.log('对话已保存到历史记录', dialogue.id);
        return true;
    } catch (error) {
        console.error('保存对话失败', error);
        return false;
    }
}

/**
 * 获取所有对话历史
 * @returns {Array} 对话历史数组
 */
function getAllDialogues() {
    try {
        return JSON.parse(localStorage.getItem('nvcChatHistory') || '[]');
    } catch (error) {
        console.error('读取对话历史失败', error);
        return [];
    }
}

/**
 * 获取特定对话
 * @param {string} id - 对话ID 
 * @returns {Object|null} 对话对象或null
 */
function getDialogueById(id) {
    try {
        const chatHistory = JSON.parse(localStorage.getItem('nvcChatHistory') || '[]');
        return chatHistory.find(dialogue => dialogue.id === id) || null;
    } catch (error) {
        console.error('获取对话失败', error);
        return null;
    }
}

/**
 * 删除特定对话
 * @param {string} id - 对话ID
 * @returns {boolean} 是否删除成功
 */
function deleteDialogue(id) {
    try {
        let chatHistory = JSON.parse(localStorage.getItem('nvcChatHistory') || '[]');
        const initialLength = chatHistory.length;
        
        // 过滤掉要删除的对话
        chatHistory = chatHistory.filter(dialogue => dialogue.id !== id);
        
        // 保存更新后的历史记录
        localStorage.setItem('nvcChatHistory', JSON.stringify(chatHistory));
        
        // 如果长度发生变化，说明成功删除了对话
        return chatHistory.length < initialLength;
    } catch (error) {
        console.error('删除对话失败', error);
        return false;
    }
}

/**
 * 清除所有对话历史
 * @returns {boolean} 是否清除成功
 */
function clearAllDialogues() {
    try {
        localStorage.setItem('nvcChatHistory', JSON.stringify([]));
        return true;
    } catch (error) {
        console.error('清除对话历史失败', error);
        return false;
    }
}

/**
 * 格式化日期时间
 * @param {string} timestamp - ISO格式的时间戳
 * @returns {string} 格式化后的日期时间字符串
 */
function formatDateTime(timestamp) {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit', 
            minute: '2-digit'
        });
    } catch (error) {
        console.error('格式化日期时间失败', error);
        return timestamp;
    }
}

// 导出函数，使其可在其他文件中使用
window.chatHistory = {
    save: saveDialogue,
    getAll: getAllDialogues,
    getById: getDialogueById,
    delete: deleteDialogue,
    clear: clearAllDialogues,
    formatDateTime: formatDateTime
};
