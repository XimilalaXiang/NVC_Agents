# CORS 跨域问题解决方案

## 问题说明

当直接在浏览器中使用JavaScript调用第三方API（如Coze API）时，通常会遇到跨域资源共享(CORS)限制。这是浏览器的一种安全机制，防止网站从其他域获取资源，除非该资源明确允许跨域访问。

错误通常会显示为：
```
Access to fetch at 'https://api.coze.cn/v3/chat' from origin 'https://your-site.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 解决方案

### 1. 使用CORS代理服务

#### 公共CORS代理

在我们的应用中，已经内置了CORS Anywhere代理选项：

```javascript
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const API_URL = "https://api.coze.cn/v3/chat";
const requestUrl = selectedMethod === 'direct' ? API_URL : CORS_PROXY + API_URL;
```

注意事项：
- 公共代理服务可能有使用限制
- 不建议在生产环境中使用公共代理
- 某些公共代理可能需要先访问其主页并获取临时访问权限

#### 腾讯云函数部署自己的代理

1. 登录腾讯云控制台
2. 创建新的云函数
3. 选择 Node.js 运行环境
4. 上传本项目中的 `proxy.js` 文件作为函数代码
5. 配置触发器为 HTTP 触发
6. 部署后，将获得一个API网关地址
7. 修改 `index.html` 中的代理URL为你自己的云函数地址

```javascript
// 修改这一行
const CORS_PROXY = "https://your-cloud-function-url.com/";
```

### 2. 使用浏览器插件临时禁用CORS

适用于开发和测试环境：

1. Chrome浏览器：安装 ["CORS Unblock"](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino) 或 ["Allow CORS"](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)
2. Firefox浏览器：安装 ["CORS Everywhere"](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/)

使用方法：
1. 安装插件后，点击插件图标启用CORS禁用功能
2. 刷新页面，再次尝试请求
3. 完成测试后记得禁用插件，以免影响正常浏览安全

### 3. 使用开发服务器代理

如果你在本地开发环境使用开发服务器：

#### 使用 http-server 和 proxy 选项

1. 安装 http-server: `npm install -g http-server`
2. 使用代理选项启动服务器:
   ```
   http-server -p 8080 --proxy https://api.coze.cn
   ```
3. 修改API URL为相对路径:
   ```javascript
   const API_URL = "/v3/chat";  // 将由http-server代理到https://api.coze.cn/v3/chat
   ```

### 4. 创建专用API网关

对于生产环境，最安全的方法是创建一个专用的API网关：

1. 使用腾讯云API网关服务
2. 配置API网关转发请求到Coze API
3. 在API网关中添加安全认证和API密钥管理
4. 设置正确的CORS头信息
5. 使用API网关提供的URL替代直接调用Coze API

### 5. 联系API提供方

如果你是Coze API的授权用户，可以联系Coze团队，请求将你的域名添加到他们的CORS许可列表中。

## 安全注意事项

1. 记住任何前端解决方案都不能真正隐藏API密钥
2. 对于生产环境，应该使用后端代理并在服务端存储API密钥
3. 添加适当的请求限制和监控，防止API滥用
4. 为API请求添加用户身份验证，限制只有授权用户可以发起请求

## 相关资源

- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [腾讯云云函数文档](https://cloud.tencent.com/document/product/583)
- [腾讯云API网关文档](https://cloud.tencent.com/document/product/628) 