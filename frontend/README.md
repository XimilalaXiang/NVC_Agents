# 非暴力沟通卡片系统

这是一个基于Web的非暴力沟通(NVC)练习系统，使用Coze API提供AI反馈，并部署在Cloudflare上。

## 项目简介

非暴力沟通卡片系统是一个交互式Web应用，旨在帮助用户学习和练习非暴力沟通技巧。系统包括以下主要功能：

1. 学习NVC的四个要素：观察、感受、需要和请求
2. 案例卡片：浏览和学习NVC的实际应用案例
3. 在线练习：输入你的NVC表达，获取AI反馈和评分
4. 练习历史：查看过去的练习记录和进步
5. 练习热力图：直观地展示你的练习频率

## 系统架构

本系统采用前端为主、后端轻量化的架构：

1. 前端：使用HTML5, CSS3, JavaScript构建，采用Bootstrap 5作为UI框架
2. 后端：使用Cloudflare Workers作为轻量级后端服务，处理API调用和跨域问题
3. API：使用Coze API进行NVC练习内容的分析和反馈

## 部署指南

### 预备条件

1. 一个Cloudflare账户
2. 一个域名(可选，但推荐)
3. Coze API访问凭证

### 部署步骤

#### 1. Cloudflare Worker部署 (必须先完成此步骤)

Worker负责处理与Coze API的交互，并解决跨域问题。必须先部署Worker，然后才能部署前端：

1. 登录Cloudflare账户，进入Workers服务
2. 点击"创建服务"，输入服务名称（如"nvc-coze-api"）
3. 创建完成后，进入服务编辑页面
4. 将`workers/coze-api-worker.js`文件的内容粘贴到编辑器中
5. 根据自己的配置修改以下部分：
   - 将`COZE_API_KEY`替换为你的Coze API密钥
   - 将`COZE_BOT_ID`替换为你的Coze机器人ID
   - 根据需要修改CORS设置（默认允许所有域名访问）
6. 点击部署
7. **记录下Worker的URL**，格式通常是`https://服务名称.你的用户名.workers.dev`，这将在下一步使用

#### 2. 配置前端代码

获得Worker URL后，需要更新前端代码：

1. 编辑`frontend/assets/js/coze-api.js`文件，找到以下代码段：
   ```javascript
   const WORKER_URL = (() => {
       if (isLocalhost) {
           // 本地开发环境
           return 'http://localhost:8787'; // 默认wrangler开发服务器端口
       } else {
           // 生产环境 - 替换为您实际部署的Worker URL
           return 'https://nvctest01.xiangasdfg.workers.dev'; // 移除末尾的斜杠
       }
   })();
   ```
2. 将其中的Worker URL替换为你在步骤1中获得的Worker实际URL

#### 3. 前端文件部署

完成Worker部署并更新前端代码后，使用Cloudflare Pages部署前端应用：

1. 将更新后的项目代码上传到GitHub或GitLab仓库
2. 登录Cloudflare账户，进入Pages服务
3. 点击"创建新项目"，连接你的代码仓库
4. 设置部署配置：
   - 构建命令: 留空（本项目是静态网站）
   - 构建输出目录: `frontend`
   - 环境变量: 可以为不同环境（如开发、预发布、生产）设置不同的变量
5. 点击部署
6. 部署完成后，你会获得一个`*.pages.dev`的URL，可以通过此URL访问你的应用

#### 4. 本地调试

如果你想在部署前进行本地调试：

1. 安装Node.js和npm
2. 全局安装Cloudflare Wrangler工具：
   ```bash
   npm install -g wrangler
   ```
3. 进入项目根目录，创建wrangler.toml配置文件：
   ```toml
   name = "nvc-coze-api"
   type = "javascript"
   account_id = "你的Cloudflare账户ID"
   workers_dev = true
   ```
4. 使用wrangler在本地启动Worker：
   ```bash
   wrangler dev
   ```
5. 使用简单的HTTP服务器工具（如http-server）启动前端应用：
   ```bash
   npx http-server frontend
   ```

## 使用指南

### 用户注册和登录

1. 访问应用首页，点击右上角"登录/注册"按钮
2. 如果已有账号，直接登录；否则点击"注册"链接创建新账号
3. 完成登录后，可以访问所有功能

### 练习NVC

1. 点击导航栏中的"练习"选项
2. 在练习表单中填写你的NVC表达：
   - 观察：客观描述事实，不包含评判
   - 感受：表达你的情感体验
   - 需要：表达你的内在需要
   - 请求：提出具体、可行的请求
3. 点击"提交练习"按钮
4. 系统会将你的输入发送到Coze API进行分析
5. 分析完成后，你会看到详细的反馈和评分
6. 可以点击"保存练习记录"将本次练习保存到你的历史记录中

### 查看历史记录

1. 点击导航栏中的"练习历史"选项
2. 在此页面可以看到：
   - 练习频率热力图：直观展示你的练习频率
   - 练习记录列表：详细的历史记录
3. 点击记录中的"查看详情"可以查看完整的练习内容和反馈

## 技术说明

### 数据存储

- 用户数据：使用localStorage存储用户信息和练习记录
- 在实际应用中，建议将这些数据存储在数据库中

### API调用

- Coze API调用通过Cloudflare Worker进行中转，避免CORS问题和泄露API密钥
- Worker接收用户的练习内容，调用Coze API，并将结果返回给前端

### 鉴权

- 当前版本使用简单的JWT令牌鉴权
- 在实际应用中，建议实现更完善的鉴权机制

## 常见问题

### Q: 为什么要使用Cloudflare Worker而不是直接调用API？

A: 直接从前端调用第三方API会遇到两个主要问题：
1. CORS限制：浏览器的同源策略会阻止直接跨域请求
2. 安全风险：API密钥会暴露在前端代码中，容易被盗用

通过Cloudflare Worker中转，可以解决这些问题。

### Q: 为什么必须先部署Worker再部署Pages？

A: 部署顺序非常重要，原因如下：
1. 前端代码需要知道Worker的确切URL才能正常调用API
2. 如果先部署Pages再部署Worker，用户访问网站时API功能将无法正常工作
3. 先部署Worker，获取其URL后更新前端代码，再部署Pages，可以确保整个应用从一开始就能正常运行

### Q: 如何修改Coze机器人ID？

A: 在`workers/coze-api-worker.js`文件中找到以下代码行：
```javascript
const COZE_BOT_ID = '替换为您的Coze机器人ID';
```
将其替换为你自己的Coze机器人ID。

## 贡献指南

欢迎提交Pull Requests或Issues来帮助改进这个项目！ 