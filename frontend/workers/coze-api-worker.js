/**
 * NVC卡片系统 - Coze API Worker
 * 此Worker充当前端与Coze API之间的代理，解决CORS问题
 */

// 允许的请求方法
const ALLOWED_METHODS = ['GET', 'POST', 'OPTIONS'];

// CORS响应头设置
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24小时
};

// Coze API配置 - 请替换为您的Coze API密钥和机器人ID
const COZE_API_KEY = 'pat_aRKDv53YJWQ5keoRqeOVVm4ws8Ny5eSuRKmThM3UzArd7JufiVtSeocCP0WAzWNS';
const COZE_BOT_ID = '7483330179063087138';
const COZE_API_URL = 'https://api.coze.com/open/api/bot/completions';

/**
 * 处理请求的主函数
 * @param {Request} request - 传入的请求对象
 * @returns {Promise<Response>} 响应对象
 */
async function handleRequest(request) {
  console.log('Worker收到请求:', request.url);
  
  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return handleCors();
  }
  
  // 检查请求方法
  if (!ALLOWED_METHODS.includes(request.method)) {
    return new Response('方法不允许', {
      status: 405,
      headers: {
        ...CORS_HEADERS,
        'Allow': ALLOWED_METHODS.join(', ')
      }
    });
  }

  try {
    // 解析URL参数
    const url = new URL(request.url);
    const data = url.searchParams.get('data');
    
    if (!data) {
      console.error('缺少必要参数: data');
      return new Response('缺少必要参数: data', {
        status: 400,
        headers: CORS_HEADERS
      });
    }
    
    console.log('解析到的数据:', data.substring(0, 100) + (data.length > 100 ? '...' : ''));
    
    // 准备Coze API请求
    const cozeApiRequest = {
      bot_id: COZE_BOT_ID,
      query: data,
      stream: false,
      // 可选择添加其他参数，例如context、reply_callback_url等
    };
    
    console.log('准备发送到Coze API的请求:', JSON.stringify(cozeApiRequest).substring(0, 100) + '...');
    
    // 调用Coze API
    const cozeResponse = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COZE_API_KEY}`
      },
      body: JSON.stringify(cozeApiRequest)
    });
    
    // 检查Coze API响应
    if (!cozeResponse.ok) {
      const errorText = await cozeResponse.text();
      console.error('Coze API响应错误:', cozeResponse.status, errorText);
      return new Response(`Coze API响应错误: ${cozeResponse.status} - ${errorText}`, {
        status: 502, // Bad Gateway
        headers: CORS_HEADERS
      });
    }
    
    // 读取并解析Coze API响应
    const responseData = await cozeResponse.json();
    console.log('Coze API响应成功:', JSON.stringify(responseData).substring(0, 100) + '...');
    
    // 返回处理后的响应
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Worker处理请求时发生错误:', error);
    return new Response(`Worker处理请求时发生错误: ${error.message}`, {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}

/**
 * 处理CORS预检请求
 * @returns {Response} CORS预检响应
 */
function handleCors() {
  return new Response(null, {
    status: 204, // No Content
    headers: CORS_HEADERS
  });
}

// 注册事件监听器
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
}); 