/**
 * cases.js - 非暴力沟通案例卡片页面逻辑
 * 处理案例卡片的筛选、收藏和用户交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initCasesPage();
    
    // 添加自动检查和修复功能
    setTimeout(fixPossibleBindingIssues, 1000);
});

/**
 * 初始化案例卡片页面
 */
function initCasesPage() {
    console.log('开始初始化案例页面...');
    
    // 显示加载状态
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('d-none');
    } else {
        console.warn('加载指示器元素未找到');
    }
    
    // 检查是否有 casesData
    console.log('检查案例数据...');
    
    // 先检查window对象
    console.log('window对象:', typeof window);
    
    // 检查casesData变量
    if (typeof casesData !== 'undefined') {
        console.log('直接访问casesData变量:', casesData.length);
        // 确保window.casesData也被设置
        if (typeof window.casesData === 'undefined') {
            console.log('设置window.casesData...');
            window.casesData = casesData;
        }
    } else {
        console.warn('casesData变量未定义');
    }
    
    if (!window.casesData || !Array.isArray(window.casesData) || window.casesData.length === 0) {
        console.error('案例数据不可用或为空！检查 cases-data.js 是否正确加载');
        
        // 尝试从页面中查找 script 标签
        const scriptTags = document.querySelectorAll('script');
        console.log('当前页面脚本标签:', scriptTags.length);
        scriptTags.forEach(script => {
            console.log('脚本来源:', script.src);
        });
        
        // 显示错误消息，帮助调试
        loadingIndicator.innerHTML = `
            <div class="text-danger mb-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                案例数据加载失败
            </div>
            <p>请检查控制台错误信息，或刷新页面重试</p>
        `;
        loadingIndicator.classList.remove('d-none');
        
        // 尝试手动重新加载cases-data.js
        console.log('尝试手动重新加载案例数据...');
        const newScript = document.createElement('script');
        newScript.src = '../assets/js/cases-data.js';
        newScript.onload = function() {
            console.log('案例数据脚本重新加载完成，尝试重新初始化页面');
            setTimeout(initCasesPage, 500);
        };
        newScript.onerror = function() {
            console.error('案例数据脚本加载失败');
            alert('案例数据加载失败，请刷新页面或联系管理员');
        };
        document.body.appendChild(newScript);
        
        return;
    }
    
    console.log(`找到 ${window.casesData.length} 个案例数据`);
    
    // 检查bootstrap是否可用
    checkBootstrapAvailability();
    
    // 模拟加载延迟，增强用户体验
    setTimeout(() => {
        // 加载案例数据
        loadCasesData();
        
        // 初始化筛选按钮事件
        initFilterButtons();
        
        // 初始化搜索功能
        initSearchFunction();
        
        // 初始化返回顶部按钮
        initBackToTopButton();
        
        // 初始化清除筛选按钮
        initClearFiltersButton();
        
        // 初始化重置按钮
        initResetFiltersButton();
        
        // 初始化加载更多按钮
        initLoadMoreButton();
        
        // 检查用户登录状态并更新UI
        updateAuthUI();
        
        // 隐藏加载状态
        if (loadingIndicator) {
            loadingIndicator.classList.add('d-none');
        }
        
        // 更新筛选统计
        updateFilterStats();
        
        // 初始化页面动画效果
        initPageAnimations();
        
        console.log('案例页面初始化完成');
    }, 300);
}

/**
 * 检查Bootstrap是否正常加载
 */
function checkBootstrapAvailability() {
    console.log('检查Bootstrap可用性');
    
    // 检查bootstrap Modal是否可用
    if (typeof bootstrap === 'undefined' || typeof bootstrap.Modal === 'undefined') {
        console.warn('Bootstrap或Modal未找到，提供兼容处理');
        
        // 定义一个兼容版本的bootstrap对象
        window.bootstrap = window.bootstrap || {};
        
        // 如果Modal不存在，提供一个简易实现
        if (!window.bootstrap.Modal) {
            window.bootstrap.Modal = class ModalPolyfill {
                constructor(element) {
                    this.element = element;
                }
                
                show() {
                    console.log('使用polyfill显示模态框');
                    this.element.classList.add('show');
                    this.element.style.display = 'block';
                    document.body.classList.add('modal-open');
                    
                    // 创建背景遮罩
                    if (!document.querySelector('.modal-backdrop')) {
                        const backdrop = document.createElement('div');
                        backdrop.className = 'modal-backdrop fade show';
                        document.body.appendChild(backdrop);
                    }
                    
                    // 绑定关闭按钮
                    const closeButtons = this.element.querySelectorAll('[data-bs-dismiss="modal"]');
                    closeButtons.forEach(button => {
                        button.addEventListener('click', () => this.hide());
                    });
                }
                
                hide() {
                    console.log('使用polyfill隐藏模态框');
                    this.element.classList.remove('show');
                    this.element.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    
                    // 移除背景遮罩
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
                }
            };
        }
    } else {
        console.log('Bootstrap Modal 可用');
    }
}

/**
 * 初始化页面动画效果
 */
function initPageAnimations() {
    // 为筛选器添加渐变背景效果
    animateGradientBackground();
    
    // 为案例卡片添加滚动显示动画
    initScrollAnimations();
}

/**
 * 为元素添加渐变背景动画
 */
function animateGradientBackground() {
    // 获取所有带有bg-glow类的元素
    const glowElements = document.querySelectorAll('.bg-glow, .bg-glow-secondary');
    
    // 对每个元素应用动画
    glowElements.forEach(element => {
        // 创建动画背景
        const glow = document.createElement('div');
        glow.className = 'glow-animation';
        glow.style.position = 'absolute';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.width = '100%';
        glow.style.height = '100%';
        glow.style.pointerEvents = 'none';
        glow.style.zIndex = '0';
        
        // 确保元素具有相对定位
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        // 添加到元素中
        element.appendChild(glow);
    });
}

/**
 * 初始化滚动显示动画
 */
function initScrollAnimations() {
    // 获取所有案例卡片
    const cards = document.querySelectorAll('.case-card');
    
    // 设置IntersectionObserver观察卡片元素
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // 监听每个卡片
    cards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * 初始化清除筛选按钮
 */
function initClearFiltersButton() {
    const clearButton = document.getElementById('clearFilters');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            // 重置所有筛选按钮到"全部"状态
            document.querySelectorAll('.filter-chip[data-filter="all"]').forEach(btn => {
                btn.click();
            });
            
            // 清空搜索框
            document.getElementById('searchInput').value = '';
            
            // 应用筛选
            applyAllFilters();
        });
    }
}

/**
 * 初始化重置筛选按钮
 */
function initResetFiltersButton() {
    const resetButton = document.getElementById('resetFiltersBtn');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // 重置所有筛选
            document.getElementById('clearFilters').click();
        });
    }
}

/**
 * 初始化加载更多按钮
 */
function initLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 模拟加载更多案例
            // 实际项目中，这里可以实现分页加载更多数据
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>加载中...';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check me-2"></i>已加载全部案例';
                this.disabled = true;
                setTimeout(() => {
                    document.getElementById('loadMoreContainer').classList.add('d-none');
                }, 2000);
            }, 1500);
        });
    }
}

/**
 * 加载案例数据并渲染到页面
 */
function loadCasesData() {
    // 确保加载指示器一定会隐藏
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('d-none');
    }
    
    console.log('开始渲染案例卡片...');
    
    // 检查数据可用性
    if (!window.casesData || !Array.isArray(window.casesData)) {
        console.error('案例数据不可用，检查 cases-data.js 是否加载');
        return;
    }
    
    // 渲染所有案例卡片
    renderCaseCards(window.casesData);
    
    // 显示加载更多按钮（如果案例数量超过一定数量）
    if (window.casesData.length > 6) {
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            loadMoreContainer.classList.remove('d-none');
        }
    }
    
    console.log('案例卡片渲染完成');
}

/**
 * 渲染案例卡片到页面
 * @param {Array} cases - 案例数据数组
 */
function renderCaseCards(cases) {
    const container = document.querySelector('.cards-container');
    container.innerHTML = '';
    
    if (cases.length === 0) {
        document.getElementById('noResultsMessage').classList.remove('d-none');
        document.getElementById('loadMoreContainer').classList.add('d-none');
        return;
    }
    
    document.getElementById('noResultsMessage').classList.add('d-none');
    
    // 更新案例数量统计
    document.getElementById('caseCount').textContent = cases.length;
    
    // 渲染案例卡片，添加淡入动画
    cases.forEach((caseItem, index) => {
        const cardElement = createCaseCard(caseItem);
        // 添加淡入效果类，但暂不添加动画，由IntersectionObserver处理
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(20px)';
        cardElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        cardElement.style.transitionDelay = `${index * 0.05}s`;
        container.appendChild(cardElement);
        
        // 强制重绘以触发CSS过渡
        setTimeout(() => {
            cardElement.style.opacity = '1';
            cardElement.style.transform = 'translateY(0)';
        }, 50);
    });
    
    // 初始化收藏功能
    initFavoritesButtons();
    
    // 初始化案例详情查看功能
    initViewDetailButtons();
}

/**
 * 创建单个案例卡片元素
 * @param {Object} caseItem - 案例数据对象
 * @returns {HTMLElement} - 卡片DOM元素
 */
function createCaseCard(caseItem) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-6 col-lg-4 mb-4 card-item';
    colDiv.setAttribute('data-role', caseItem.role);
    colDiv.setAttribute('data-issue', caseItem.issue);
    
    // 构建NVC要素标签
    const nvcElementsList = getNvcElementsTags(caseItem);
    
    // 构建要素角色类
    let roleTagClass = 'tag-equal';
    if (caseItem.role === 'authority') {
        roleTagClass = 'tag-authority';
    } else if (caseItem.role === 'mixed') {
        roleTagClass = 'tag-mixed';
    }
    
    // 构建卡点类
    let issueTagClass = 'tag-expression';
    if (caseItem.issue === 'emotion') {
        issueTagClass = 'tag-emotion';
    } else if (caseItem.issue === 'conflict') {
        issueTagClass = 'tag-conflict';
    }
    
    // 使用新的卡片布局
    colDiv.innerHTML = `
        <div class="case-card gradient-border glow-hover">
            <div class="card-body">
                <div class="case-header">
                    <div>
                        <h5 class="case-title text-gradient">${caseItem.title}</h5>
                        <div class="case-category">
                            <span class="case-tag ${roleTagClass}">
                                <i class="fas ${getRoleIcon(caseItem.role)} me-1"></i>${getRoleName(caseItem.role)}
                            </span>
                            <span class="case-tag ${issueTagClass}">
                                <i class="fas ${getIssueIcon(caseItem.issue)} me-1"></i>${getIssueName(caseItem.issue)}
                            </span>
                        </div>
                    </div>
                    <div class="case-bookmark pulse-glow" data-case-id="${caseItem.id}" title="收藏案例">
                        <i class="far fa-star"></i>
                    </div>
                </div>
                
                <p class="case-description">${caseItem.context}</p>
                
                <div class="case-nvc-elements">
                    ${nvcElementsList}
                </div>
                
                <div class="case-footer">
                    <div class="case-actions">
                        <button class="case-btn view-detail-btn btn-glow" data-case-id="${caseItem.id}">
                            <i class="fas fa-eye"></i>查看详情
                        </button>
                        <button class="case-btn case-btn-primary practice-btn btn-glow" data-case-id="${caseItem.id}">
                            <i class="fas fa-pen"></i>练习
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加点击事件处理
    const bookmarkBtn = colDiv.querySelector('.case-bookmark');
    bookmarkBtn.addEventListener('click', function() {
        toggleBookmark(this, caseItem.id);
    });
    
    // 添加练习按钮的点击事件
    const practiceBtn = colDiv.querySelector('.practice-btn');
    practiceBtn.addEventListener('click', function() {
        goToPractice(caseItem.id);
    });
    
    // 为已收藏的案例添加活跃样式
    if (isCaseBookmarked(caseItem.id)) {
        bookmarkBtn.classList.add('active');
        bookmarkBtn.querySelector('i').classList.remove('far');
        bookmarkBtn.querySelector('i').classList.add('fas');
    }
    
    return colDiv;
}

/**
 * 获取NVC要素标签
 * @param {Object} caseItem - 案例数据对象
 * @returns {string} - NVC要素标签HTML
 */
function getNvcElementsTags(caseItem) {
    let tags = '';
    
    // 处理不同的字段名称可能性
    const nvcElements = caseItem.nvcElements || {};
    
    // 使用正确的字段名，与cases-data.js保持一致
    const hasObservation = nvcElements.observation;
    const hasFeeling = nvcElements.feeling;
    const hasNeed = nvcElements.need;
    const hasRequest = nvcElements.request;
    
    // 构建标签
    if (hasObservation) {
        tags += `<div class="case-nvc-element nvc-observation">
            <i class="fas fa-eye"></i>观察
        </div>`;
    }
    
    if (hasFeeling) {
        tags += `<div class="case-nvc-element nvc-feeling">
            <i class="fas fa-heart"></i>感受
        </div>`;
    }
    
    if (hasNeed) {
        tags += `<div class="case-nvc-element nvc-need">
            <i class="fas fa-seedling"></i>需要
        </div>`;
    }
    
    if (hasRequest) {
        tags += `<div class="case-nvc-element nvc-request">
            <i class="fas fa-hand-holding-heart"></i>请求
        </div>`;
    }
    
    // 如果没有任何NVC要素，显示全部四个要素
    if (!tags) {
        tags = `
            <div class="case-nvc-element nvc-observation">
                <i class="fas fa-eye"></i>观察
            </div>
            <div class="case-nvc-element nvc-feeling">
                <i class="fas fa-heart"></i>感受
            </div>
            <div class="case-nvc-element nvc-need">
                <i class="fas fa-seedling"></i>需要
            </div>
            <div class="case-nvc-element nvc-request">
                <i class="fas fa-hand-holding-heart"></i>请求
            </div>
        `;
    }
    
    return tags;
}

/**
 * 获取角色关系图标
 * @param {string} role - 角色关系类型
 * @returns {string} - 图标类名
 */
function getRoleIcon(role) {
    switch(role) {
        case 'authority': return 'fa-user-tie';
        case 'equal': return 'fa-user-friends';
        case 'mixed': return 'fa-people-arrows';
        default: return 'fa-user';
    }
}

/**
 * 获取沟通卡点图标
 * @param {string} issue - 沟通卡点类型
 * @returns {string} - 图标类名
 */
function getIssueIcon(issue) {
    switch(issue) {
        case 'emotion': return 'fa-heart';
        case 'expression': return 'fa-comment';
        case 'conflict': return 'fa-fire';
        default: return 'fa-question-circle';
    }
}

/**
 * 获取角色关系名称
 * @param {string} role - 角色关系类型
 * @returns {string} - 角色关系名称
 */
function getRoleName(role) {
    switch(role) {
        case 'authority': return '权威角色';
        case 'equal': return '平等角色';
        case 'mixed': return '混合角色';
        default: return '未分类';
    }
}

/**
 * 获取沟通卡点名称
 * @param {string} issue - 沟通卡点类型
 * @returns {string} - 沟通卡点名称
 */
function getIssueName(issue) {
    switch(issue) {
        case 'emotion': return '情绪管理';
        case 'expression': return '表达模式';
        case 'conflict': return '冲突处理';
        default: return '未分类';
    }
}

/**
 * 初始化筛选按钮事件
 */
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-chip');
    
    if (!filterButtons || filterButtons.length === 0) {
        console.error('筛选按钮未找到');
        return;
    }
    
    console.log('初始化筛选按钮, 数量:', filterButtons.length);
    
    // 先移除已有的事件监听器（防止重复绑定）
    filterButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // 重新获取按钮并添加事件
    const refreshedButtons = document.querySelectorAll('.filter-chip');
    refreshedButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const filterType = this.getAttribute('data-filter-type');
            
            console.log('筛选按钮点击:', {filter, filterType});
            
            // 移除同类型按钮的活跃状态
            const sameTypeButtons = document.querySelectorAll(`.filter-chip[data-filter-type="${filterType}"]`);
            
            sameTypeButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前按钮的活跃状态
            this.classList.add('active');
            
            // 应用筛选
            applyAllFilters();
        });
    });
}

/**
 * 应用所有筛选条件
 */
function applyAllFilters() {
    console.log('应用筛选条件');
    
    // 获取当前角色筛选值
    const activeRoleButton = document.querySelector('.filter-chip[data-filter-type="role"].active');
    const roleFilter = activeRoleButton ? activeRoleButton.getAttribute('data-filter') : 'all';
    
    // 获取当前卡点筛选值
    const activeIssueButton = document.querySelector('.filter-chip[data-filter-type="issue"].active');
    const issueFilter = activeIssueButton ? activeIssueButton.getAttribute('data-filter') : 'all';
    
    // 获取搜索关键词
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    console.log('筛选条件:', {roleFilter, issueFilter, searchTerm});
    
    // 筛选数据
    const filteredCases = window.casesData.filter(caseItem => {
        // 角色筛选
        const passRoleFilter = roleFilter === 'all' || caseItem.role === roleFilter;
        
        // 卡点筛选
        const passIssueFilter = issueFilter === 'all' || caseItem.issue === issueFilter;
        
        // 搜索筛选
        let passSearchFilter = true;
        if (searchTerm !== '') {
            passSearchFilter = 
                caseItem.title.toLowerCase().includes(searchTerm) || 
                caseItem.context.toLowerCase().includes(searchTerm) || 
                (caseItem.traditional && caseItem.traditional.toLowerCase().includes(searchTerm)) || 
                (caseItem.nvc && caseItem.nvc.toLowerCase().includes(searchTerm));
        }
        
        return passRoleFilter && passIssueFilter && passSearchFilter;
    });
    
    console.log('筛选后案例数量:', filteredCases.length);
    
    // 渲染筛选后的卡片
    renderCaseCards(filteredCases);
    
    // 更新活动筛选条件显示
    updateActiveFilters(roleFilter, issueFilter, searchTerm);
    
    // 更新筛选统计
    updateFilterStats();
}

/**
 * 更新活动筛选条件显示
 * @param {string} roleFilter - 角色筛选条件
 * @param {string} issueFilter - 问题筛选条件
 * @param {string} searchTerm - 搜索关键词
 */
function updateActiveFilters(roleFilter, issueFilter, searchTerm) {
    const activeFiltersContainer = document.getElementById('activeFilters');
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    // 添加角色筛选标签
    if (roleFilter !== 'all') {
        addActiveFilterTag(activeFiltersContainer, '角色: ' + getRoleName(roleFilter), 'role');
    }
    
    // 添加问题筛选标签
    if (issueFilter !== 'all') {
        addActiveFilterTag(activeFiltersContainer, '卡点: ' + getIssueName(issueFilter), 'issue');
    }
    
    // 添加搜索关键词标签
    if (searchTerm) {
        addActiveFilterTag(activeFiltersContainer, '搜索: ' + searchTerm, 'search');
    }
}

/**
 * 添加活动筛选标签
 * @param {HTMLElement} container - 标签容器
 * @param {string} text - 标签文本
 * @param {string} type - 筛选类型
 */
function addActiveFilterTag(container, text, type) {
    const tag = document.createElement('div');
    tag.className = 'active-filter-tag';
    tag.setAttribute('data-filter-type', type);
    tag.innerHTML = `
        ${text}
        <span class="remove-filter"><i class="fas fa-times"></i></span>
    `;
    
    // 添加点击移除事件
    tag.querySelector('.remove-filter').addEventListener('click', function() {
        if (type === 'role' || type === 'issue') {
            // 点击对应的"全部"按钮
            document.querySelector(`.filter-chip[data-filter-type="${type}"][data-filter="all"]`).click();
        } else if (type === 'search') {
            // 清空搜索框并应用筛选
            document.getElementById('searchInput').value = '';
            applyAllFilters();
        }
    });
    
    container.appendChild(tag);
}

/**
 * 更新筛选统计信息
 */
function updateFilterStats() {
    // 计算活跃筛选条件数量
    const activeFiltersCount = document.querySelectorAll('.active-filter-tag').length;
    
    // 更新筛选统计容器的可见性
    const filterStatsContainer = document.querySelector('.filter-stats');
    if (filterStatsContainer) {
        filterStatsContainer.style.display = activeFiltersCount > 0 ? 'flex' : 'none';
    }
}

/**
 * 初始化搜索功能
 */
function initSearchFunction() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (!searchInput || !searchButton) {
        console.error('搜索元素未找到');
        return;
    }
    
    console.log('初始化搜索功能');
    
    // 移除可能存在的旧事件监听器
    const newSearchButton = searchButton.cloneNode(true);
    searchButton.parentNode.replaceChild(newSearchButton, searchButton);
    
    const newSearchInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newSearchInput, searchInput);
    
    // 搜索按钮点击事件
    document.getElementById('searchButton').addEventListener('click', function() {
        console.log('搜索按钮点击，关键词:', document.getElementById('searchInput').value);
        applyAllFilters();
    });
    
    // 输入框回车事件
    document.getElementById('searchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            console.log('搜索输入框回车，关键词:', this.value);
            applyAllFilters();
        }
    });
}

/**
 * 初始化案例详情查看功能
 */
function initViewDetailButtons() {
    console.log('初始化查看详情按钮');
    
    // 获取所有查看详情按钮
    const viewDetailButtons = document.querySelectorAll('.view-detail-btn');
    
    // 检查是否找到按钮
    if (!viewDetailButtons || viewDetailButtons.length === 0) {
        console.warn('查看详情按钮未找到，可能是卡片还未渲染');
        return;
    }
    
    console.log(`找到 ${viewDetailButtons.length} 个查看详情按钮`);
    
    // 为每个按钮添加事件处理器
    viewDetailButtons.forEach(button => {
        // 使用克隆替换方式清除旧事件
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // 重新获取所有按钮并添加事件监听器
    document.querySelectorAll('.view-detail-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const caseId = this.getAttribute('data-case-id');
            console.log(`点击查看详情按钮，案例ID: ${caseId}`);
            
            if (!caseId) {
                console.error('案例ID未找到');
                return;
            }
            
            // 直接调用模态框显示函数
            showCaseDetail(caseId);
        });
    });
}

/**
 * 切换收藏状态
 * @param {HTMLElement} bookmarkBtn - 收藏按钮元素
 * @param {string} caseId - 案例ID
 */
function toggleBookmark(bookmarkBtn, caseId) {
    const isLoggedIn = checkUserLogin();
    
    if (!isLoggedIn) {
        // 如果用户未登录，提示登录
        showLoginPrompt('收藏案例');
        return;
    }
    
    // 获取当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // 获取收藏列表或创建新列表
    if (!currentUser.bookmarks) {
        currentUser.bookmarks = [];
    }
    
    // 查找是否已经收藏
    const bookmarkIndex = currentUser.bookmarks.indexOf(caseId);
    
    // 切换收藏状态
    if (bookmarkIndex > -1) {
        // 已收藏，取消收藏
        currentUser.bookmarks.splice(bookmarkIndex, 1);
        bookmarkBtn.classList.remove('active');
        bookmarkBtn.querySelector('i').classList.remove('fas');
        bookmarkBtn.querySelector('i').classList.add('far');
        
        // 添加取消收藏动画
        bookmarkBtn.classList.add('shake-animation');
        setTimeout(() => {
            bookmarkBtn.classList.remove('shake-animation');
        }, 500);
        
        showToast('案例已从收藏中移除', 'info');
    } else {
        // 未收藏，添加收藏
        currentUser.bookmarks.push(caseId);
        bookmarkBtn.classList.add('active');
        bookmarkBtn.querySelector('i').classList.remove('far');
        bookmarkBtn.querySelector('i').classList.add('fas');
        
        // 添加收藏成功动画
        bookmarkBtn.classList.add('pop-animation');
        setTimeout(() => {
            bookmarkBtn.classList.remove('pop-animation');
        }, 500);
        
        showToast('案例已成功收藏', 'success');
    }
    
    // 更新用户数据
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // 更新用户数据
    updateUserData(currentUser);
}

/**
 * 检查案例是否已收藏
 * @param {string} caseId - 案例ID
 * @returns {boolean} - 是否已收藏
 */
function isCaseBookmarked(caseId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.bookmarks) {
        return false;
    }
    
    return currentUser.bookmarks.includes(caseId);
}

/**
 * 显示登录提示
 * @param {string} action - 用户尝试执行的操作
 */
function showLoginPrompt(action) {
    // 创建模态框
    if (!document.getElementById('loginPromptModal')) {
        const modalHTML = `
            <div class="modal fade" id="loginPromptModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content gradient-border">
                        <div class="modal-header">
                            <h5 class="modal-title">需要登录</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="关闭"></button>
                        </div>
                        <div class="modal-body">
                            <p>要${action}，您需要先登录账号。</p>
                            <p>登录后即可保存您的收藏和练习记录。</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-glow" data-bs-dismiss="modal">取消</button>
                            <a href="./login.html" class="btn btn-primary btn-glow">去登录</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstChild);
    }
    
    // 显示模态框
    const loginPromptModal = new bootstrap.Modal(document.getElementById('loginPromptModal'));
    loginPromptModal.show();
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型（success, info, warning, danger）
 */
function showToast(message, type = 'info') {
    // 创建toast容器
    if (!document.getElementById('toastContainer')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // 创建toast
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div class="toast fade-in-up" id="${toastId}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-${type} text-white">
                <strong class="me-auto">${type === 'success' ? '成功' : type === 'info' ? '提示' : type === 'warning' ? '警告' : '错误'}</strong>
                <small>刚刚</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="关闭"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    const container = document.getElementById('toastContainer');
    container.insertAdjacentHTML('beforeend', toastHTML);
    
    // 显示toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });
    toast.show();
    
    // 显示后自动移除
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

/**
 * 前往练习页面
 * @param {string} caseId - 案例ID
 */
function goToPractice(caseId) {
    // 将案例ID存储在会话存储中
    sessionStorage.setItem('practiceCase', caseId);
    
    // 跳转到练习页面
    window.location.href = './practice.html';
}

/**
 * 初始化返回顶部按钮
 */
function initBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 点击事件
    backToTopBtn.addEventListener('click', function() {
        // 添加滚动动画
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 显示案例详情
 * @param {string} caseId - 案例ID
 */
function showCaseDetail(caseId) {
    console.log(`正在显示案例详情，ID: ${caseId}`);
    
    // 查找案例数据
    const caseItem = window.casesData.find(item => item.id === caseId);
    
    if (!caseItem) {
        console.error(`未找到ID为 ${caseId} 的案例数据`);
        alert('无法找到该案例数据');
        return;
    }
    
    console.log('找到案例数据:', caseItem);
    
    // 处理NVC元素字段
    const nvcElements = caseItem.nvcElements || {};
    const observation = nvcElements.observation || '描述客观事实，不带评判';
    const feeling = nvcElements.feeling || '表达自己的情感体验';
    const need = nvcElements.need || '识别满足或未满足的需要';
    const request = nvcElements.request || '明确具体的行动请求';
    
    // 移除可能已存在的模态框
    const existingModal = document.getElementById('caseDetailModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 创建新的模态框
    const modalHTML = `
        <div class="modal fade" id="caseDetailModal" tabindex="-1" aria-labelledby="caseDetailTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content gradient-border">
                    <div class="modal-header">
                        <h5 class="modal-title text-gradient" id="caseDetailTitle">${caseItem.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="关闭"></button>
                    </div>
                    <div class="modal-body">
                        <div class="case-detail-section">
                            <div class="case-category mb-3">
                                <span class="case-tag tag-${caseItem.role}">
                                    <i class="fas ${getRoleIcon(caseItem.role)} me-1"></i>${getRoleName(caseItem.role)}
                                </span>
                                <span class="case-tag tag-${caseItem.issue}">
                                    <i class="fas ${getIssueIcon(caseItem.issue)} me-1"></i>${getIssueName(caseItem.issue)}
                                </span>
                            </div>
                            <p>${caseItem.context}</p>
                        </div>
                        
                        <div class="case-detail-section">
                            <h6 class="case-detail-section-title">
                                <i class="fas fa-comment-alt text-danger"></i>传统表达方式
                            </h6>
                            <div class="traditional-expression">
                                <div class="expression-label">传统</div>
                                <p class="mb-0">${caseItem.traditional}</p>
                            </div>
                        </div>
                        
                        <div class="case-detail-section">
                            <h6 class="case-detail-section-title">
                                <i class="fas fa-comment-alt text-success"></i>NVC表达方式
                            </h6>
                            <div class="nvc-expression">
                                <div class="expression-label">NVC</div>
                                <p class="mb-0">${caseItem.nvc}</p>
                            </div>
                        </div>
                        
                        <div class="case-detail-section">
                            <h6 class="case-detail-section-title">
                                <i class="fas fa-lightbulb text-warning"></i>NVC分析
                            </h6>
                            <div class="nvc-analysis">
                                <div class="nvc-element-block observation-block">
                                    <div class="nvc-element-icon">
                                        <i class="fas fa-eye"></i>
                                    </div>
                                    <div class="nvc-element-content">
                                        <h6>观察</h6>
                                        <p class="mb-0">${observation}</p>
                                    </div>
                                </div>
                                
                                <div class="nvc-element-block feelings-block">
                                    <div class="nvc-element-icon">
                                        <i class="fas fa-heart"></i>
                                    </div>
                                    <div class="nvc-element-content">
                                        <h6>感受</h6>
                                        <p class="mb-0">${feeling}</p>
                                    </div>
                                </div>
                                
                                <div class="nvc-element-block needs-block">
                                    <div class="nvc-element-icon">
                                        <i class="fas fa-seedling"></i>
                                    </div>
                                    <div class="nvc-element-content">
                                        <h6>需要</h6>
                                        <p class="mb-0">${need}</p>
                                    </div>
                                </div>
                                
                                <div class="nvc-element-block requests-block">
                                    <div class="nvc-element-icon">
                                        <i class="fas fa-hand-holding-heart"></i>
                                    </div>
                                    <div class="nvc-element-content">
                                        <h6>请求</h6>
                                        <p class="mb-0">${request}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="case-detail-section">
                            <h6 class="case-detail-section-title">
                                <i class="fas fa-graduation-cap text-primary"></i>学习要点
                            </h6>
                            <div class="learning-points">
                                <ul class="mb-0">
                                    <li>观察与评价分离，描述客观事实</li>
                                    <li>表达真实感受，而非思考或解释</li>
                                    <li>识别未被满足的需要</li>
                                    <li>提出明确、可行的请求</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary btn-glow" id="bookmarkDetailBtn" data-case-id="${caseId}">
                            <i class="${isCaseBookmarked(caseId) ? 'fas' : 'far'} fa-star me-1"></i>${isCaseBookmarked(caseId) ? '已收藏' : '收藏案例'}
                        </button>
                        <button type="button" class="btn btn-primary btn-glow" id="practiceCaseBtn" data-case-id="${caseId}">
                            <i class="fas fa-pen me-1"></i>练习表达
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加模态框到页面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    console.log('模态框已添加到页面');
    
    // 获取模态框元素
    const modalElement = document.getElementById('caseDetailModal');
    
    // 添加收藏按钮点击事件
    const bookmarkBtn = document.getElementById('bookmarkDetailBtn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function() {
            const currentCaseId = this.getAttribute('data-case-id');
            console.log('点击收藏按钮:', currentCaseId);
            
            // 找到对应的收藏按钮并触发点击
            const listBookmarkBtn = document.querySelector(`.case-bookmark[data-case-id="${currentCaseId}"]`);
            if (listBookmarkBtn) {
                toggleBookmark(listBookmarkBtn, currentCaseId);
                
                // 更新按钮状态
                if (isCaseBookmarked(currentCaseId)) {
                    this.innerHTML = '<i class="fas fa-star me-1"></i>已收藏';
                    this.classList.add('btn-outline-warning');
                    this.classList.remove('btn-outline-primary');
                } else {
                    this.innerHTML = '<i class="far fa-star me-1"></i>收藏案例';
                    this.classList.remove('btn-outline-warning');
                    this.classList.add('btn-outline-primary');
                }
            }
        });
    }
    
    // 添加练习按钮点击事件
    const practiceBtn = document.getElementById('practiceCaseBtn');
    if (practiceBtn) {
        practiceBtn.addEventListener('click', function() {
            const currentCaseId = this.getAttribute('data-case-id');
            console.log('点击练习按钮:', currentCaseId);
            goToPractice(currentCaseId);
        });
    }
    
    // 创建并显示Bootstrap模态框
    try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            console.log('Bootstrap 模态框显示成功');
        } else {
            throw new Error('Bootstrap Modal 不可用');
        }
    } catch (error) {
        console.error('显示模态框时出错:', error);
        
        // 备用方案: 使用基本的显示/隐藏方法
        modalElement.style.display = 'block';
        modalElement.classList.add('show');
        document.body.classList.add('modal-open');
        
        // 创建背景遮罩
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
        
        // 添加关闭功能
        const closeButtons = modalElement.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                modalElement.style.display = 'none';
                modalElement.classList.remove('show');
                document.body.classList.remove('modal-open');
                
                const backdropElement = document.querySelector('.modal-backdrop');
                if (backdropElement) {
                    backdropElement.remove();
                }
            });
        });
    }
}

/**
 * 修复可能的按钮绑定问题
 */
function fixPossibleBindingIssues() {
    console.log('检查并修复可能的按钮绑定问题');
    
    // 检查页面上案例卡片是否存在
    const caseCards = document.querySelectorAll('.case-card');
    console.log(`当前页面有 ${caseCards.length} 个案例卡片`);
    
    if (caseCards.length === 0) {
        // 卡片未渲染，可能是初始化有问题，尝试重新加载
        console.warn('未找到案例卡片，尝试重新加载数据');
        loadCasesData();
    }
    
    // 重新绑定收藏按钮事件
    initFavoritesButtons();
    
    // 重新绑定查看详情按钮事件
    initViewDetailButtons();
    
    // 重新检查筛选按钮
    const filterButtons = document.querySelectorAll('.filter-chip');
    if (filterButtons.length > 0) {
        // 检查是否有活跃的筛选按钮
        const activeButtons = document.querySelectorAll('.filter-chip.active');
        if (activeButtons.length === 0) {
            console.warn('没有活跃的筛选按钮，尝试激活"全部"按钮');
            
            // 激活"全部"筛选按钮
            const allRoleButton = document.querySelector('.filter-chip[data-filter="all"][data-filter-type="role"]');
            if (allRoleButton) {
                allRoleButton.classList.add('active');
            }
            
            const allIssueButton = document.querySelector('.filter-chip[data-filter="all"][data-filter-type="issue"]');
            if (allIssueButton) {
                allIssueButton.classList.add('active');
            }
        }
    }
    
    // 检查模态框是否存在但未正确关闭
    const existingModal = document.getElementById('caseDetailModal');
    if (existingModal && existingModal.classList.contains('show')) {
        console.log('检测到可能未正确关闭的模态框，尝试关闭');
        try {
            if (typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(existingModal);
                if (modal) {
                    modal.hide();
                }
            } else {
                existingModal.style.display = 'none';
                existingModal.classList.remove('show');
                
                // 移除背景遮罩
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                
                document.body.classList.remove('modal-open');
            }
        } catch (error) {
            console.error('尝试关闭现有模态框时出错:', error);
        }
    }
    
    console.log('完成按钮绑定检查和修复');
}

/**
 * 初始化收藏按钮功能
 */
function initFavoritesButtons() {
    console.log('初始化收藏按钮...');
    
    // 获取所有收藏按钮
    const bookmarkButtons = document.querySelectorAll('.case-bookmark');
    
    if (!bookmarkButtons || bookmarkButtons.length === 0) {
        console.warn('未找到收藏按钮，可能卡片还未渲染');
        return;
    }
    
    console.log(`找到 ${bookmarkButtons.length} 个收藏按钮`);
    
    // 移除旧事件监听器并添加新的
    bookmarkButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // 重新绑定点击事件
    document.querySelectorAll('.case-bookmark').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            const caseId = this.getAttribute('data-case-id');
            if (!caseId) {
                console.error('收藏按钮没有案例ID');
                return;
            }
            
            console.log('点击收藏按钮, 案例ID:', caseId);
            toggleBookmark(this, caseId);
        });
        
        // 更新收藏状态显示
        const caseId = button.getAttribute('data-case-id');
        if (caseId && isCaseBookmarked(caseId)) {
            button.classList.add('active');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
        } else {
            button.classList.remove('active');
            button.querySelector('i').classList.remove('fas');
            button.querySelector('i').classList.add('far');
        }
    });
}

// ... 保留其他原有函数 ...