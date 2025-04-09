// 这是一个可以部署到腾讯云云函数或Cloudflare Workers的简单代理服务
// 它将帮助解决浏览器中的CORS问题

/**
 * 代理服务入口函数，用于转发请求到Coze API
 * 
 * 云函数入口点 - 根据不同云平台有不同配置方式
 * - 腾讯云云函数: 设置 main_handler 或 index.main_handler 为入口函数
 * - Cloudflare Workers: 使用 addEventListener('fetch', event => {...})
 */
exports.main_handler = async (event, context) => {
  try {
    // 获取请求信息 (腾讯云云函数格式)
    const method = event.httpMethod || 'POST';
    let body = '';
    
    // 解析请求体
    if (event.body) {
      body = typeof event.body === 'string' ? event.body : JSON.stringify(event.body);
    }
    
    // 发送请求到Coze API
    const response = await fetch('https://api.coze.cn/v3/chat', {
      method: method,
      headers: {
        'Authorization': 'Bearer pat_Fl4a5XU7dGl8Oy7RzkaGQAYouQ3a46CqhIo16AOpPvKxP2WQDJpjdrsVk6aRK2sC',
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: body
    });
    
    // 读取响应流
    const reader = response.body.getReader();
    let result = '';
    let responseBuffer = [];
    
    // 设置响应头
    const headers = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
    
    // 腾讯云云函数响应格式
    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        message: "这是一个代理服务器，请使用正确的流式请求方式调用"
      })
    };
  } catch (error) {
    // 错误处理
    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};

/**
 * 以下是Cloudflare Workers版本的代理代码
 * 如果您选择使用Cloudflare Workers，可以使用这部分代码
 */
/*
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 处理OPTIONS请求，返回CORS头信息
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  // 处理实际请求
  try {
    const requestBody = await request.json();
    
    // 转发请求到Coze API
    const response = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pat_Fl4a5XU7dGl8Oy7RzkaGQAYouQ3a46CqhIo16AOpPvKxP2WQDJpjdrsVk6aRK2sC',
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(requestBody)
    });
    
    // 创建一个可读流的转换
    const { readable, writable } = new TransformStream();
    response.body.pipeTo(writable);
    
    // 返回响应
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
*/ 