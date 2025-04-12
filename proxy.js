/**
 * proxy.js - 腾讯云函数代理，解决Coze API跨域问题
 * 
 * 部署说明：
 * 1. 登录腾讯云控制台: https://console.cloud.tencent.com/
 * 2. 进入云函数服务
 * 3. 创建新的函数，选择Node.js运行环境
 * 4. 上传此文件作为index.js，入口函数自动设置为"main_handler"
 * 5. 配置HTTP触发方式
 * 6. 部署成功后，修改前端代码中的API_URL为此云函数的URL
 */

// 主处理函数 - 腾讯云函数的入口点
exports.main_handler = async (event, context) => {
  console.log('收到请求:', JSON.stringify(event).substring(0, 500));
  
  // 解析请求头和请求体
  const { headers, body, httpMethod } = event;
  
  // CORS处理 - 设置响应头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24小时缓存预检请求结果
  };
  
  // 处理OPTIONS预检请求
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }
  
  try {
    // 仅允许POST请求
    if (httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: '方法不允许，只接受POST请求' })
      };
    }
    
    // 解析请求体
    let requestData;
    try {
      requestData = typeof body === 'string' ? JSON.parse(body) : body;
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: '无效的JSON请求体' })
      };
    }
    
    // 从请求中获取授权信息
    const authorization = headers.Authorization || headers.authorization;
    if (!authorization) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: '缺少授权信息' })
      };
    }
    
    // 准备发送到Coze API的请求
    const cozeApiUrl = 'https://api.coze.cn/v3/chat';
    
    // 转发请求到Coze API
    const fetch = require('node-fetch'); // 云函数需要安装此依赖
    const response = await fetch(cozeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
        'Accept': 'text/event-stream' // 支持流式响应
      },
      body: JSON.stringify(requestData)
    });
    
    // 获取响应结果
    const responseStatus = response.status;
    const responseHeaders = response.headers.raw();
    
    // 如果收到的是流式响应
    if (response.headers.get('content-type') && 
        response.headers.get('content-type').includes('text/event-stream')) {
      
      // 读取流式响应
      const responseBody = await response.text();
      
      // 返回函数响应
      return {
        statusCode: responseStatus,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
        body: responseBody
      };
    } else {
      // 处理普通JSON响应
      const responseBody = await response.text();
      
      return {
        statusCode: responseStatus,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: responseBody
      };
    }
  } catch (error) {
    console.error('处理请求时发生错误:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: '处理请求时发生错误',
        message: error.message,
        stack: error.stack
      })
    };
  }
}; 