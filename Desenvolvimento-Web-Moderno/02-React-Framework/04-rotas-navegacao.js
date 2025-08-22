/**
 * 🛣️ MÓDULO 2.4: ROTAS E NAVEGAÇÃO COM REACT ROUTER
 * 
 * Este arquivo aborda o sistema de roteamento em aplicações React,
 * cobrindo desde conceitos básicos até técnicas avançadas de navegação.
 * 
 * 📚 TÓPICOS ABORDADOS:
 * • React Router DOM fundamentals
 * • Rotas aninhadas e layouts
 * • Parâmetros de rota e query strings
 * • Navegação programática
 * • Guards de rota e proteção
 * • Lazy loading e code splitting
 * • Histórico e navegação
 * • SEO e meta tags dinâmicas
 * 
 * 🎯 OBJETIVOS DE APRENDIZAGEM:
 * • Configurar roteamento em aplicações React
 * • Implementar navegação complexa
 * • Otimizar carregamento com lazy loading
 * • Proteger rotas com autenticação
 * • Gerenciar estado de navegação
 * • Implementar SEO-friendly routing
 * 
 * 👨‍🏫 PROFESSOR: Este módulo ensina roteamento moderno em React
 * com foco em performance, UX e boas práticas de arquitetura.
 */

// =============================================================================
// 1. CONFIGURAÇÃO BÁSICA DO REACT ROUTER
// =============================================================================

/**
 * 🚀 SETUP INICIAL
 * 
 * Configuração básica do React Router DOM para uma aplicação SPA
 */

// Simulação das importações do React Router
const ReactRouterSimulation = {
    // Componentes principais
    BrowserRouter: 'BrowserRouter',
    Routes: 'Routes',
    Route: 'Route',
    Link: 'Link',
    NavLink: 'NavLink',
    Navigate: 'Navigate',
    Outlet: 'Outlet',
    
    // Hooks
    useNavigate: 'useNavigate',
    useLocation: 'useLocation',
    useParams: 'useParams',
    useSearchParams: 'useSearchParams',
    
    // Utilitários
    createBrowserRouter: 'createBrowserRouter',
    RouterProvider: 'RouterProvider'
};

/**
 * 🏠 COMPONENTE APP COM ROTEAMENTO
 * 
 * Estrutura principal da aplicação com React Router
 */
function AppWithRouter() {
    // Simulação do BrowserRouter
    return {
        component: 'BrowserRouter',
        children: [
            {
                component: 'Routes',
                children: [
                    {
                        component: 'Route',
                        path: '/',
                        element: 'HomePage'
                    },
                    {
                        component: 'Route',
                        path: '/about',
                        element: 'AboutPage'
                    },
                    {
                        component: 'Route',
                        path: '/products',
                        element: 'ProductsPage'
                    },
                    {
                        component: 'Route',
                        path: '/products/:id',
                        element: 'ProductDetailPage'
                    },
                    {
                        component: 'Route',
                        path: '/dashboard/*',
                        element: 'DashboardLayout'
                    },
                    {
                        component: 'Route',
                        path: '*',
                        element: 'NotFoundPage'
                    }
                ]
            }
        ]
    };
}

/**
 * 🧭 COMPONENTE DE NAVEGAÇÃO
 * 
 * Barra de navegação com links ativos
 */
function Navigation() {
    const navigationItems = [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/about', label: 'Sobre', icon: 'ℹ️' },
        { to: '/products', label: 'Produtos', icon: '🛍️' },
        { to: '/dashboard', label: 'Dashboard', icon: '📊' }
    ];
    
    // Simulação do useLocation
    const currentPath = window.location.pathname;
    
    return {
        render: () => {
            return `
                <nav class="main-navigation">
                    <div class="nav-brand">
                        <h2>🚀 React Router App</h2>
                    </div>
                    <ul class="nav-links">
                        ${navigationItems.map(item => `
                            <li>
                                <a href="${item.to}" 
                                   class="nav-link ${currentPath === item.to ? 'active' : ''}">
                                    <span class="nav-icon">${item.icon}</span>
                                    <span class="nav-label">${item.label}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>
            `;
        }
    };
}

// =============================================================================
// 2. PÁGINAS E COMPONENTES
// =============================================================================

/**
 * 🏠 PÁGINA HOME
 * 
 * Página inicial da aplicação
 */
function HomePage() {
    return {
        render: () => `
            <div class="page home-page">
                <header class="hero-section">
                    <h1>🏠 Bem-vindo ao React Router</h1>
                    <p>Aprenda navegação moderna em aplicações React</p>
                    <div class="hero-actions">
                        <a href="/products" class="btn btn-primary">Ver Produtos</a>
                        <a href="/about" class="btn btn-secondary">Sobre Nós</a>
                    </div>
                </header>
                
                <section class="features">
                    <h2>🎯 Recursos Demonstrados</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <h3>🛣️ Roteamento Básico</h3>
                            <p>Navegação entre páginas com React Router</p>
                        </div>
                        <div class="feature-card">
                            <h3>📱 Rotas Dinâmicas</h3>
                            <p>Parâmetros de URL e rotas aninhadas</p>
                        </div>
                        <div class="feature-card">
                            <h3>🔒 Rotas Protegidas</h3>
                            <p>Autenticação e guards de rota</p>
                        </div>
                        <div class="feature-card">
                            <h3>⚡ Lazy Loading</h3>
                            <p>Carregamento otimizado de componentes</p>
                        </div>
                    </div>
                </section>
            </div>
        `
    };
}

/**
 * ℹ️ PÁGINA SOBRE
 * 
 * Informações sobre a aplicação
 */
function AboutPage() {
    return {
        render: () => `
            <div class="page about-page">
                <header class="page-header">
                    <h1>ℹ️ Sobre Nossa Aplicação</h1>
                    <p>Demonstração completa de React Router</p>
                </header>
                
                <div class="content-sections">
                    <section class="about-section">
                        <h2>🎯 Objetivo</h2>
                        <p>Esta aplicação demonstra os principais conceitos e técnicas de roteamento em React usando React Router DOM.</p>
                    </section>
                    
                    <section class="about-section">
                        <h2>🛠️ Tecnologias</h2>
                        <ul class="tech-list">
                            <li>React 18+</li>
                            <li>React Router DOM v6</li>
                            <li>JavaScript ES6+</li>
                            <li>CSS3 Moderno</li>
                        </ul>
                    </section>
                    
                    <section class="about-section">
                        <h2>📚 Conceitos Abordados</h2>
                        <div class="concepts-grid">
                            <div class="concept-item">Roteamento Básico</div>
                            <div class="concept-item">Rotas Aninhadas</div>
                            <div class="concept-item">Parâmetros de Rota</div>
                            <div class="concept-item">Navegação Programática</div>
                            <div class="concept-item">Guards de Rota</div>
                            <div class="concept-item">Lazy Loading</div>
                        </div>
                    </section>
                </div>
            </div>
        `
    };
}

/**
 * 🛍️ PÁGINA DE PRODUTOS
 * 
 * Lista de produtos com navegação para detalhes
 */
function ProductsPage() {
    const products = [
        { id: 1, name: 'Smartphone Pro', price: 999, category: 'Eletrônicos', image: '📱' },
        { id: 2, name: 'Laptop Gaming', price: 1599, category: 'Computadores', image: '💻' },
        { id: 3, name: 'Headphone Wireless', price: 299, category: 'Áudio', image: '🎧' },
        { id: 4, name: 'Smart Watch', price: 399, category: 'Wearables', image: '⌚' },
        { id: 5, name: 'Tablet Pro', price: 799, category: 'Tablets', image: '📱' },
        { id: 6, name: 'Camera DSLR', price: 1299, category: 'Fotografia', image: '📷' }
    ];
    
    // Simulação de filtros e busca
    const [filters, setFilters] = {
        category: 'all',
        search: '',
        sortBy: 'name'
    };
    
    return {
        render: () => `
            <div class="page products-page">
                <header class="page-header">
                    <h1>🛍️ Nossos Produtos</h1>
                    <p>Explore nossa coleção de produtos incríveis</p>
                </header>
                
                <div class="products-filters">
                    <div class="filter-group">
                        <label>🔍 Buscar:</label>
                        <input type="text" placeholder="Nome do produto..." class="search-input">
                    </div>
                    <div class="filter-group">
                        <label>📂 Categoria:</label>
                        <select class="category-filter">
                            <option value="all">Todas</option>
                            <option value="Eletrônicos">Eletrônicos</option>
                            <option value="Computadores">Computadores</option>
                            <option value="Áudio">Áudio</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>📊 Ordenar:</label>
                        <select class="sort-filter">
                            <option value="name">Nome</option>
                            <option value="price">Preço</option>
                            <option value="category">Categoria</option>
                        </select>
                    </div>
                </div>
                
                <div class="products-grid">
                    ${products.map(product => `
                        <div class="product-card" data-product-id="${product.id}">
                            <div class="product-image">${product.image}</div>
                            <div class="product-info">
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-category">${product.category}</p>
                                <p class="product-price">R$ ${product.price}</p>
                                <div class="product-actions">
                                    <a href="/products/${product.id}" class="btn btn-primary">Ver Detalhes</a>
                                    <button class="btn btn-secondary">Adicionar ao Carrinho</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
    };
}

/**
 * 📱 PÁGINA DE DETALHES DO PRODUTO
 * 
 * Detalhes de um produto específico com parâmetros de rota
 */
function ProductDetailPage() {
    // Simulação do useParams
    const productId = parseInt(window.location.pathname.split('/').pop());
    
    const products = {
        1: {
            id: 1,
            name: 'Smartphone Pro',
            price: 999,
            category: 'Eletrônicos',
            image: '📱',
            description: 'O smartphone mais avançado do mercado com tecnologia de ponta.',
            features: ['Tela OLED 6.7"', 'Câmera 108MP', '5G', 'Bateria 5000mAh'],
            specs: {
                'Processador': 'Snapdragon 8 Gen 2',
                'RAM': '12GB',
                'Armazenamento': '256GB',
                'Sistema': 'Android 13'
            },
            reviews: [
                { user: 'João', rating: 5, comment: 'Excelente produto!' },
                { user: 'Maria', rating: 4, comment: 'Muito bom, recomendo.' }
            ]
        },
        2: {
            id: 2,
            name: 'Laptop Gaming',
            price: 1599,
            category: 'Computadores',
            image: '💻',
            description: 'Laptop para jogos com performance excepcional.',
            features: ['RTX 4060', 'Intel i7', '16GB RAM', 'SSD 1TB'],
            specs: {
                'Processador': 'Intel Core i7-12700H',
                'Placa de Vídeo': 'RTX 4060 8GB',
                'RAM': '16GB DDR5',
                'Armazenamento': '1TB SSD NVMe'
            },
            reviews: [
                { user: 'Pedro', rating: 5, comment: 'Perfeito para jogos!' },
                { user: 'Ana', rating: 5, comment: 'Excelente custo-benefício.' }
            ]
        }
        // Mais produtos...
    };
    
    const product = products[productId];
    
    if (!product) {
        return {
            render: () => `
                <div class="page not-found-page">
                    <h1>❌ Produto não encontrado</h1>
                    <p>O produto que você está procurando não existe.</p>
                    <a href="/products" class="btn btn-primary">Voltar aos Produtos</a>
                </div>
            `
        };
    }
    
    return {
        render: () => `
            <div class="page product-detail-page">
                <nav class="breadcrumb">
                    <a href="/">Home</a> > 
                    <a href="/products">Produtos</a> > 
                    <span>${product.name}</span>
                </nav>
                
                <div class="product-detail">
                    <div class="product-gallery">
                        <div class="main-image">${product.image}</div>
                        <div class="image-thumbnails">
                            <div class="thumbnail active">${product.image}</div>
                            <div class="thumbnail">${product.image}</div>
                            <div class="thumbnail">${product.image}</div>
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <h1 class="product-title">${product.name}</h1>
                        <p class="product-category">${product.category}</p>
                        <p class="product-price">R$ ${product.price}</p>
                        
                        <div class="product-description">
                            <h3>📝 Descrição</h3>
                            <p>${product.description}</p>
                        </div>
                        
                        <div class="product-features">
                            <h3>✨ Características</h3>
                            <ul>
                                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-primary btn-large">🛒 Adicionar ao Carrinho</button>
                            <button class="btn btn-secondary">❤️ Favoritar</button>
                            <button class="btn btn-outline">📤 Compartilhar</button>
                        </div>
                    </div>
                </div>
                
                <div class="product-tabs">
                    <div class="tab-buttons">
                        <button class="tab-button active" data-tab="specs">📋 Especificações</button>
                        <button class="tab-button" data-tab="reviews">⭐ Avaliações</button>
                        <button class="tab-button" data-tab="related">🔗 Relacionados</button>
                    </div>
                    
                    <div class="tab-content">
                        <div class="tab-panel active" id="specs-panel">
                            <h3>📋 Especificações Técnicas</h3>
                            <table class="specs-table">
                                ${Object.entries(product.specs).map(([key, value]) => `
                                    <tr>
                                        <td class="spec-label">${key}</td>
                                        <td class="spec-value">${value}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        </div>
                        
                        <div class="tab-panel" id="reviews-panel">
                            <h3>⭐ Avaliações dos Clientes</h3>
                            <div class="reviews-list">
                                ${product.reviews.map(review => `
                                    <div class="review-item">
                                        <div class="review-header">
                                            <span class="review-user">${review.user}</span>
                                            <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                                        </div>
                                        <p class="review-comment">${review.comment}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="tab-panel" id="related-panel">
                            <h3>🔗 Produtos Relacionados</h3>
                            <p>Outros produtos que você pode gostar...</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    };
}

// =============================================================================
// 3. ROTAS ANINHADAS E LAYOUTS
// =============================================================================

/**
 * 📊 LAYOUT DO DASHBOARD
 * 
 * Layout com rotas aninhadas para área administrativa
 */
function DashboardLayout() {
    const dashboardRoutes = [
        { path: '', label: 'Visão Geral', icon: '📊' },
        { path: 'users', label: 'Usuários', icon: '👥' },
        { path: 'products', label: 'Produtos', icon: '📦' },
        { path: 'orders', label: 'Pedidos', icon: '🛒' },
        { path: 'analytics', label: 'Analytics', icon: '📈' },
        { path: 'settings', label: 'Configurações', icon: '⚙️' }
    ];
    
    const currentPath = window.location.pathname.replace('/dashboard', '') || '/';
    
    return {
        render: () => `
            <div class="dashboard-layout">
                <aside class="dashboard-sidebar">
                    <div class="sidebar-header">
                        <h2>📊 Dashboard</h2>
                    </div>
                    <nav class="sidebar-nav">
                        ${dashboardRoutes.map(route => `
                            <a href="/dashboard${route.path ? '/' + route.path : ''}" 
                               class="sidebar-link ${currentPath === '/' + route.path ? 'active' : ''}">
                                <span class="sidebar-icon">${route.icon}</span>
                                <span class="sidebar-label">${route.label}</span>
                            </a>
                        `).join('')}
                    </nav>
                </aside>
                
                <main class="dashboard-main">
                    <header class="dashboard-header">
                        <h1>Dashboard</h1>
                        <div class="header-actions">
                            <button class="btn btn-outline">🔔 Notificações</button>
                            <button class="btn btn-primary">👤 Perfil</button>
                        </div>
                    </header>
                    
                    <div class="dashboard-content">
                        ${this.renderCurrentPage(currentPath)}
                    </div>
                </main>
            </div>
        `
    },
    
    renderCurrentPage: (path) => {
        switch (path) {
            case '/':
                return `
                    <div class="dashboard-overview">
                        <h2>📊 Visão Geral</h2>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <h3>👥 Usuários</h3>
                                <p class="stat-number">1,234</p>
                                <p class="stat-change">+12% este mês</p>
                            </div>
                            <div class="stat-card">
                                <h3>📦 Produtos</h3>
                                <p class="stat-number">567</p>
                                <p class="stat-change">+5% este mês</p>
                            </div>
                            <div class="stat-card">
                                <h3>🛒 Pedidos</h3>
                                <p class="stat-number">890</p>
                                <p class="stat-change">+18% este mês</p>
                            </div>
                            <div class="stat-card">
                                <h3>💰 Receita</h3>
                                <p class="stat-number">R$ 45,678</p>
                                <p class="stat-change">+22% este mês</p>
                            </div>
                        </div>
                    </div>
                `;
            case '/users':
                return `
                    <div class="dashboard-users">
                        <h2>👥 Gerenciar Usuários</h2>
                        <p>Lista e gerenciamento de usuários do sistema.</p>
                    </div>
                `;
            case '/products':
                return `
                    <div class="dashboard-products">
                        <h2>📦 Gerenciar Produtos</h2>
                        <p>Adicionar, editar e remover produtos.</p>
                    </div>
                `;
            default:
                return `
                    <div class="dashboard-page">
                        <h2>🚧 Página em Construção</h2>
                        <p>Esta seção está sendo desenvolvida.</p>
                    </div>
                `;
        }
    }
    };
}

// =============================================================================
// 4. NAVEGAÇÃO PROGRAMÁTICA E HOOKS
// =============================================================================

/**
 * 🧭 HOOKS DE NAVEGAÇÃO
 * 
 * Simulação dos principais hooks do React Router
 */
const RouterHooks = {
    
    /**
     * 🚀 useNavigate
     * 
     * Hook para navegação programática
     */
    useNavigate: () => {
        return {
            navigate: (to, options = {}) => {
                console.log(`🧭 Navegando para: ${to}`, options);
                
                if (options.replace) {
                    window.history.replaceState(null, '', to);
                } else {
                    window.history.pushState(null, '', to);
                }
                
                // Simular mudança de página
                window.dispatchEvent(new PopStateEvent('popstate'));
            },
            
            goBack: () => {
                console.log('⬅️ Voltando na história');
                window.history.back();
            },
            
            goForward: () => {
                console.log('➡️ Avançando na história');
                window.history.forward();
            }
        };
    },
    
    /**
     * 📍 useLocation
     * 
     * Hook para acessar informações da localização atual
     */
    useLocation: () => {
        const url = new URL(window.location.href);
        
        return {
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
            state: window.history.state,
            key: Date.now().toString()
        };
    },
    
    /**
     * 🎯 useParams
     * 
     * Hook para acessar parâmetros da rota
     */
    useParams: () => {
        const pathname = window.location.pathname;
        const segments = pathname.split('/').filter(Boolean);
        
        // Simulação simples de extração de parâmetros
        const params = {};
        
        if (segments[0] === 'products' && segments[1]) {
            params.id = segments[1];
        }
        
        if (segments[0] === 'dashboard' && segments[1]) {
            params.section = segments[1];
        }
        
        return params;
    },
    
    /**
     * 🔍 useSearchParams
     * 
     * Hook para gerenciar query parameters
     */
    useSearchParams: () => {
        const urlParams = new URLSearchParams(window.location.search);
        
        return [
            urlParams,
            (newParams) => {
                const url = new URL(window.location.href);
                url.search = newParams.toString();
                window.history.pushState(null, '', url.toString());
            }
        ];
    }
};

/**
 * 🔍 COMPONENTE DE BUSCA COM QUERY PARAMS
 * 
 * Demonstra uso de searchParams para filtros
 */
function SearchComponent() {
    const [searchParams, setSearchParams] = RouterHooks.useSearchParams();
    
    const currentSearch = searchParams.get('q') || '';
    const currentCategory = searchParams.get('category') || 'all';
    const currentSort = searchParams.get('sort') || 'name';
    
    const updateSearch = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        
        setSearchParams(newParams);
    };
    
    return {
        render: () => `
            <div class="search-component">
                <h3>🔍 Busca Avançada</h3>
                <div class="search-form">
                    <div class="form-group">
                        <label>Termo de busca:</label>
                        <input 
                            type="text" 
                            value="${currentSearch}" 
                            placeholder="Digite sua busca..."
                            onchange="updateSearch('q', this.value)"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label>Categoria:</label>
                        <select onchange="updateSearch('category', this.value)">
                            <option value="all" ${currentCategory === 'all' ? 'selected' : ''}>Todas</option>
                            <option value="electronics" ${currentCategory === 'electronics' ? 'selected' : ''}>Eletrônicos</option>
                            <option value="books" ${currentCategory === 'books' ? 'selected' : ''}>Livros</option>
                            <option value="clothing" ${currentCategory === 'clothing' ? 'selected' : ''}>Roupas</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Ordenar por:</label>
                        <select onchange="updateSearch('sort', this.value)">
                            <option value="name" ${currentSort === 'name' ? 'selected' : ''}>Nome</option>
                            <option value="price" ${currentSort === 'price' ? 'selected' : ''}>Preço</option>
                            <option value="rating" ${currentSort === 'rating' ? 'selected' : ''}>Avaliação</option>
                        </select>
                    </div>
                </div>
                
                <div class="search-results">
                    <p>Resultados para: <strong>${currentSearch || 'todos os produtos'}</strong></p>
                    <p>Categoria: <strong>${currentCategory}</strong></p>
                    <p>Ordenação: <strong>${currentSort}</strong></p>
                </div>
            </div>
        `,
        
        updateSearch
    };
}

// =============================================================================
// 5. GUARDS DE ROTA E PROTEÇÃO
// =============================================================================

/**
 * 🔒 SISTEMA DE AUTENTICAÇÃO
 * 
 * Simulação de autenticação para proteção de rotas
 */
const AuthSystem = {
    // Estado de autenticação simulado
    currentUser: null,
    isAuthenticated: false,
    
    /**
     * 🔑 Login
     */
    login: (credentials) => {
        console.log('🔑 Fazendo login...', credentials);
        
        // Simulação de autenticação
        setTimeout(() => {
            AuthSystem.currentUser = {
                id: 1,
                name: 'João Silva',
                email: credentials.email,
                role: 'admin',
                avatar: '👤'
            };
            AuthSystem.isAuthenticated = true;
            
            // Salvar no localStorage
            localStorage.setItem('user', JSON.stringify(AuthSystem.currentUser));
            localStorage.setItem('token', 'fake-jwt-token');
            
            console.log('✅ Login realizado com sucesso!');
            
            // Redirecionar para dashboard
            window.location.href = '/dashboard';
        }, 1000);
    },
    
    /**
     * 🚪 Logout
     */
    logout: () => {
        console.log('🚪 Fazendo logout...');
        
        AuthSystem.currentUser = null;
        AuthSystem.isAuthenticated = false;
        
        // Limpar localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        console.log('✅ Logout realizado com sucesso!');
        
        // Redirecionar para home
        window.location.href = '/';
    },
    
    /**
     * 🔍 Verificar autenticação
     */
    checkAuth: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            AuthSystem.currentUser = JSON.parse(user);
            AuthSystem.isAuthenticated = true;
            return true;
        }
        
        return false;
    },
    
    /**
     * 🛡️ Verificar permissões
     */
    hasPermission: (requiredRole) => {
        if (!AuthSystem.isAuthenticated) return false;
        
        const userRole = AuthSystem.currentUser?.role;
        const roleHierarchy = ['user', 'admin', 'super-admin'];
        
        const userLevel = roleHierarchy.indexOf(userRole);
        const requiredLevel = roleHierarchy.indexOf(requiredRole);
        
        return userLevel >= requiredLevel;
    }
};

/**
 * 🛡️ COMPONENTE DE ROTA PROTEGIDA
 * 
 * Higher-Order Component para proteger rotas
 */
function ProtectedRoute({ children, requiredRole = 'user' }) {
    const isAuthenticated = AuthSystem.checkAuth();
    const hasPermission = AuthSystem.hasPermission(requiredRole);
    
    if (!isAuthenticated) {
        return {
            render: () => `
                <div class="auth-required">
                    <div class="auth-card">
                        <h2>🔒 Acesso Restrito</h2>
                        <p>Você precisa estar logado para acessar esta página.</p>
                        <div class="auth-actions">
                            <button onclick="showLoginModal()" class="btn btn-primary">Fazer Login</button>
                            <a href="/" class="btn btn-secondary">Voltar ao Início</a>
                        </div>
                    </div>
                </div>
            `
        };
    }
    
    if (!hasPermission) {
        return {
            render: () => `
                <div class="permission-denied">
                    <div class="error-card">
                        <h2>⛔ Acesso Negado</h2>
                        <p>Você não tem permissão para acessar esta página.</p>
                        <p>Nível necessário: <strong>${requiredRole}</strong></p>
                        <p>Seu nível: <strong>${AuthSystem.currentUser?.role}</strong></p>
                        <div class="error-actions">
                            <a href="/dashboard" class="btn btn-primary">Ir para Dashboard</a>
                            <a href="/" class="btn btn-secondary">Voltar ao Início</a>
                        </div>
                    </div>
                </div>
            `
        };
    }
    
    return children;
}

/**
 * 🔑 MODAL DE LOGIN
 * 
 * Componente de login para autenticação
 */
function LoginModal() {
    return {
        render: () => `
            <div class="modal-overlay" id="login-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🔑 Fazer Login</h2>
                        <button class="modal-close" onclick="hideLoginModal()">✕</button>
                    </div>
                    
                    <form class="login-form" onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label>📧 Email:</label>
                            <input 
                                type="email" 
                                name="email" 
                                required 
                                placeholder="seu@email.com"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label>🔒 Senha:</label>
                            <input 
                                type="password" 
                                name="password" 
                                required 
                                placeholder="Sua senha"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" name="remember">
                                Lembrar de mim
                            </label>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary btn-full">Entrar</button>
                            <a href="#" class="forgot-password">Esqueci minha senha</a>
                        </div>
                    </form>
                    
                    <div class="login-footer">
                        <p>Não tem uma conta? <a href="#">Cadastre-se</a></p>
                    </div>
                </div>
            </div>
        `,
        
        show: () => {
            document.getElementById('login-modal').style.display = 'flex';
        },
        
        hide: () => {
            document.getElementById('login-modal').style.display = 'none';
        },
        
        handleSubmit: (event) => {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const credentials = {
                email: formData.get('email'),
                password: formData.get('password'),
                remember: formData.get('remember')
            };
            
            AuthSystem.login(credentials);
        }
    };
}

// =============================================================================
// 6. LAZY LOADING E CODE SPLITTING
// =============================================================================

/**
 * ⚡ SISTEMA DE LAZY LOADING
 * 
 * Simulação de carregamento lazy de componentes
 */
const LazyLoader = {
    // Cache de componentes carregados
    componentCache: new Map(),
    
    /**
     * 📦 Carregar componente dinamicamente
     */
    loadComponent: async (componentName) => {
        console.log(`⚡ Carregando componente: ${componentName}`);
        
        // Verificar cache
        if (LazyLoader.componentCache.has(componentName)) {
            console.log(`📋 Componente ${componentName} encontrado no cache`);
            return LazyLoader.componentCache.get(componentName);
        }
        
        // Simular carregamento assíncrono
        return new Promise((resolve) => {
            setTimeout(() => {
                const component = LazyLoader.createLazyComponent(componentName);
                LazyLoader.componentCache.set(componentName, component);
                
                console.log(`✅ Componente ${componentName} carregado com sucesso`);
                resolve(component);
            }, Math.random() * 1000 + 500); // 500-1500ms
        });
    },
    
    /**
     * 🏗️ Criar componente lazy
     */
    createLazyComponent: (componentName) => {
        const components = {
            'AdminPanel': () => ({
                render: () => `
                    <div class="admin-panel">
                        <h2>👑 Painel Administrativo</h2>
                        <p>Componente carregado dinamicamente!</p>
                        <div class="admin-stats">
                            <div class="stat-item">
                                <h3>📊 Estatísticas</h3>
                                <p>Dados em tempo real</p>
                            </div>
                            <div class="stat-item">
                                <h3>👥 Usuários Online</h3>
                                <p>1,234 usuários</p>
                            </div>
                        </div>
                    </div>
                `
            }),
            
            'ReportsModule': () => ({
                render: () => `
                    <div class="reports-module">
                        <h2>📈 Módulo de Relatórios</h2>
                        <p>Relatórios avançados carregados sob demanda!</p>
                        <div class="reports-grid">
                            <div class="report-card">
                                <h3>💰 Vendas</h3>
                                <p>Relatório de vendas mensais</p>
                            </div>
                            <div class="report-card">
                                <h3>👥 Usuários</h3>
                                <p>Análise de comportamento</p>
                            </div>
                        </div>
                    </div>
                `
            }),
            
            'SettingsPanel': () => ({
                render: () => `
                    <div class="settings-panel">
                        <h2>⚙️ Configurações Avançadas</h2>
                        <p>Painel de configurações carregado dinamicamente!</p>
                        <div class="settings-sections">
                            <div class="setting-group">
                                <h3>🎨 Aparência</h3>
                                <p>Configurações de tema e layout</p>
                            </div>
                            <div class="setting-group">
                                <h3>🔔 Notificações</h3>
                                <p>Preferências de notificação</p>
                            </div>
                        </div>
                    </div>
                `
            })
        };
        
        return components[componentName] ? components[componentName]() : null;
    }
};

/**
 * 🔄 COMPONENTE DE LOADING
 * 
 * Indicador de carregamento para lazy loading
 */
function LoadingSpinner() {
    return {
        render: () => `
            <div class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Carregando...</p>
                </div>
            </div>
        `
    };
}

/**
 * ⚡ COMPONENTE LAZY
 * 
 * Wrapper para componentes com lazy loading
 */
function LazyComponent({ componentName, fallback = LoadingSpinner() }) {
    let isLoading = true;
    let component = null;
    let error = null;
    
    // Carregar componente
    LazyLoader.loadComponent(componentName)
        .then((loadedComponent) => {
            component = loadedComponent;
            isLoading = false;
            // Re-render seria necessário em React real
        })
        .catch((err) => {
            error = err;
            isLoading = false;
        });
    
    return {
        render: () => {
            if (isLoading) {
                return fallback.render();
            }
            
            if (error) {
                return `
                    <div class="error-boundary">
                        <h3>❌ Erro ao carregar componente</h3>
                        <p>Não foi possível carregar o componente ${componentName}</p>
                        <button onclick="location.reload()" class="btn btn-primary">Tentar Novamente</button>
                    </div>
                `;
            }
            
            return component ? component.render() : '';
        }
    };
}

// =============================================================================
// 7. ESTILOS CSS
// =============================================================================

/**
 * 🎨 ESTILOS PARA ROTEAMENTO
 * 
 * CSS completo para todos os componentes de roteamento
 */
const routingStyles = `
/* Reset e Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f8f9fa;
}

/* Navegação Principal */
.main-navigation {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 0 20px;
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand h2 {
    color: #007bff;
    margin: 15px 0;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 20px;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    text-decoration: none;
    color: #666;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.nav-link:hover {
    background: #f8f9fa;
    color: #007bff;
}

.nav-link.active {
    background: #007bff;
    color: white;
}

/* Layout de Página */
.page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: calc(100vh - 80px);
}

.page-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 40px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
}

.page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.page-header p {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* Home Page */
.hero-section {
    text-align: center;
    padding: 60px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    margin-bottom: 40px;
}

.hero-section h1 {
    font-size: 3rem;
    margin-bottom: 20px;
}

.hero-section p {
    font-size: 1.3rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.hero-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.features {
    margin-top: 60px;
}

.features h2 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 2rem;
    color: #333;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.feature-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-card h3 {
    color: #007bff;
    margin-bottom: 15px;
    font-size: 1.3rem;
}

/* Botões */
.btn {
    display: inline-block;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #545b62;
}

.btn-outline {
    background: transparent;
    color: #007bff;
    border: 2px solid #007bff;
}

.btn-outline:hover {
    background: #007bff;
    color: white;
}

.btn-large {
    padding: 16px 32px;
    font-size: 1.1rem;
}

.btn-full {
    width: 100%;
}

/* Produtos */
.products-filters {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.filter-group label {
    font-weight: 600;
    color: #555;
}

.search-input,
.category-filter,
.sort-filter {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}

.product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-image {
    font-size: 4rem;
    text-align: center;
    padding: 30px;
    background: #f8f9fa;
}

.product-info {
    padding: 20px;
}

.product-name {
    font-size: 1.3rem;
    margin-bottom: 10px;
    color: #333;
}

.product-category {
    color: #666;
    margin-bottom: 10px;
}

.product-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 20px;
}

.product-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

/* Detalhes do Produto */
.breadcrumb {
    margin-bottom: 20px;
    padding: 10px 0;
    color: #666;
}

.breadcrumb a {
    color: #007bff;
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
}

.product-gallery {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.main-image {
    font-size: 8rem;
    text-align: center;
    padding: 40px;
    background: #f8f9fa;
    border-radius: 12px;
}

.image-thumbnails {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.thumbnail {
    font-size: 2rem;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s ease;
}

.thumbnail.active,
.thumbnail:hover {
    opacity: 1;
}

.product-title {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #333;
}

.product-description,
.product-features {
    margin: 20px 0;
}

.product-description h3,
.product-features h3 {
    margin-bottom: 10px;
    color: #007bff;
}

.product-features ul {
    list-style: none;
    padding-left: 0;
}

.product-features li {
    padding: 5px 0;
    border-bottom: 1px solid #eee;
}

.product-features li:before {
    content: '✓';
    color: #28a745;
    margin-right: 10px;
    font-weight: bold;
}

/* Tabs */
.product-tabs {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

.tab-buttons {
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #ddd;
}

.tab-button {
    flex: 1;
    padding: 15px 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.tab-button.active {
    background: white;
    color: #007bff;
    border-bottom: 3px solid #007bff;
}

.tab-content {
    padding: 30px;
}

.tab-panel {
    display: none;
}

.tab-panel.active {
    display: block;
}

.specs-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.specs-table tr {
    border-bottom: 1px solid #eee;
}

.spec-label {
    padding: 12px 0;
    font-weight: 600;
    color: #555;
    width: 30%;
}

.spec-value {
    padding: 12px 0;
    color: #333;
}

.reviews-list {
    margin-top: 20px;
}

.review-item {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    margin-bottom: 15px;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.review-user {
    font-weight: 600;
    color: #333;
}

.review-rating {
    color: #ffc107;
}

/* Dashboard */
.dashboard-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: calc(100vh - 80px);
    gap: 0;
}

.dashboard-sidebar {
    background: #2c3e50;
    color: white;
    padding: 0;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
    color: white;
    margin: 0;
}

.sidebar-nav {
    padding: 20px 0;
}

.sidebar-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 20px;
    color: #bdc3c7;
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
}

.sidebar-link:hover {
    background: #34495e;
    color: white;
}

.sidebar-link.active {
    background: #3498db;
    color: white;
    border-left-color: #2980b9;
}

.dashboard-main {
    background: #f8f9fa;
    display: flex;
    flex-direction: column;
}

.dashboard-header {
    background: white;
    padding: 20px 30px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dashboard-header h1 {
    margin: 0;
    color: #333;
}

.header-actions {
    display: flex;
    gap: 15px;
}

.dashboard-content {
    flex: 1;
    padding: 30px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
}

.stat-card h3 {
    color: #666;
    margin-bottom: 10px;
    font-size: 1rem;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #007bff;
    margin: 10px 0;
}

.stat-change {
    color: #28a745;
    font-weight: 600;
}

/* Autenticação */
.auth-required,
.permission-denied {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
}

.auth-card,
.error-card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 400px;
    width: 100%;
}

.auth-card h2,
.error-card h2 {
    margin-bottom: 20px;
    color: #333;
}

.auth-actions,
.error-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
    flex-wrap: wrap;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    margin: 0;
    color: #333;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 5px;
}

.login-form {
    padding: 30px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #555;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: normal;
}

.checkbox-label input {
    width: auto;
}

.form-actions {
    margin-top: 30px;
}

.forgot-password {
    display: block;
    text-align: center;
    margin-top: 15px;
    color: #007bff;
    text-decoration: none;
}

.login-footer {
    padding: 20px 30px;
    border-top: 1px solid #eee;
    text-align: center;
    background: #f8f9fa;
}

.login-footer a {
    color: #007bff;
    text-decoration: none;
}

/* Loading */
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.loading-spinner {
    text-align: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error Boundary */
.error-boundary {
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    margin: 20px 0;
}

.error-boundary h3 {
    color: #c53030;
    margin-bottom: 10px;
}

/* Busca */
.search-component {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin: 20px 0;
}

.search-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.search-results {
    margin-top: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

/* Responsividade */
@media (max-width: 768px) {
    .main-navigation {
        flex-direction: column;
        padding: 10px;
    }
    
    .nav-links {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .hero-section h1 {
        font-size: 2rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .products-filters {
        flex-direction: column;
    }
    
    .product-detail {
        grid-template-columns: 1fr;
    }
    
    .dashboard-layout {
        grid-template-columns: 1fr;
    }
    
    .dashboard-sidebar {
        order: 2;
    }
    
    .dashboard-main {
        order: 1;
    }
    
    .tab-buttons {
        flex-direction: column;
    }
    
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .auth-actions,
    .error-actions {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .page {
        padding: 10px;
    }
    
    .page-header {
        padding: 20px 10px;
    }
    
    .page-header h1 {
        font-size: 1.8rem;
    }
    
    .product-actions {
        flex-direction: column;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
`;

// =============================================================================
// 8. FUNÇÕES UTILITÁRIAS E INICIALIZAÇÃO
// =============================================================================

/**
 * 🚀 FUNÇÕES GLOBAIS
 * 
 * Funções utilitárias para interação com a interface
 */
window.showLoginModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
};

window.hideLoginModal = () => {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.handleLogin = (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember')
    };
    
    console.log('🔑 Tentativa de login:', credentials);
    
    // Simular autenticação
    AuthSystem.login(credentials);
    
    // Fechar modal
    window.hideLoginModal();
};

window.updateSearch = (key, value) => {
    const url = new URL(window.location.href);
    
    if (value && value !== 'all') {
        url.searchParams.set(key, value);
    } else {
        url.searchParams.delete(key);
    }
    
    window.history.pushState(null, '', url.toString());
    console.log(`🔍 Filtro atualizado: ${key} = ${value}`);
};

/**
 * 🎯 INICIALIZAÇÃO DA APLICAÇÃO
 * 
 * Função principal para inicializar a aplicação de roteamento
 */
function initRoutingApp() {
    console.log('🚀 Inicializando aplicação de roteamento React...');
    
    // Verificar autenticação ao carregar
    AuthSystem.checkAuth();
    
    // Criar elementos da interface
    const appContainer = document.createElement('div');
    appContainer.id = 'routing-app';
    
    // Adicionar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = routingStyles;
    document.head.appendChild(styleSheet);
    
    // Renderizar navegação
    const navigation = Navigation();
    appContainer.innerHTML = navigation.render();
    
    // Renderizar página atual baseada na URL
    const currentPath = window.location.pathname;
    let currentPage;
    
    if (currentPath === '/') {
        currentPage = HomePage();
    } else if (currentPath === '/about') {
        currentPage = AboutPage();
    } else if (currentPath === '/products') {
        currentPage = ProductsPage();
    } else if (currentPath.startsWith('/products/')) {
        currentPage = ProductDetailPage();
    } else if (currentPath.startsWith('/dashboard')) {
        currentPage = DashboardLayout();
    } else {
        currentPage = {
            render: () => `
                <div class="page not-found-page">
                    <div class="error-card">
                        <h1>🔍 Página não encontrada</h1>
                        <p>A página que você está procurando não existe.</p>
                        <div class="error-actions">
                            <a href="/" class="btn btn-primary">Voltar ao Início</a>
                        </div>
                    </div>
                </div>
            `
        };
    }
    
    // Adicionar página atual
    appContainer.innerHTML += currentPage.render();
    
    // Adicionar modal de login
    const loginModal = LoginModal();
    appContainer.innerHTML += loginModal.render();
    
    // Adicionar ao DOM
    document.body.appendChild(appContainer);
    
    // Configurar navegação por cliques
    setupNavigation();
    
    // Configurar tabs
    setupTabs();
    
    console.log('✅ Aplicação de roteamento inicializada com sucesso!');
}

/**
 * 🧭 CONFIGURAR NAVEGAÇÃO
 * 
 * Interceptar cliques em links para navegação SPA
 */
function setupNavigation() {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');
        
        if (link && link.href.startsWith(window.location.origin)) {
            event.preventDefault();
            
            const url = new URL(link.href);
            const path = url.pathname + url.search + url.hash;
            
            // Atualizar URL
            window.history.pushState(null, '', path);
            
            // Recarregar página
            location.reload();
        }
    });
    
    // Lidar com botões voltar/avançar
    window.addEventListener('popstate', () => {
        location.reload();
    });
}

/**
 * 📑 CONFIGURAR TABS
 * 
 * Sistema de tabs para detalhes do produto
 */
function setupTabs() {
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('tab-button')) {
            const tabName = event.target.dataset.tab;
            
            // Remover classe active de todos os botões
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Adicionar classe active ao botão clicado
            event.target.classList.add('active');
            
            // Esconder todos os painéis
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Mostrar painel correspondente
            const targetPanel = document.getElementById(`${tabName}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        }
    });
}

// =============================================================================
// 9. CONCEITOS PRINCIPAIS
// =============================================================================

/**
 * 📚 CONCEITOS DE ROTEAMENTO
 * 
 * Explicação dos principais conceitos abordados neste módulo
 */
const RoutingConcepts = {
    
    /**
     * 🛣️ ROTEAMENTO BÁSICO
     * 
     * Conceitos fundamentais de roteamento em SPAs
     */
    basicRouting: {
        description: `
            O roteamento em aplicações React permite navegar entre diferentes 
            "páginas" sem recarregar o navegador, mantendo a experiência de 
            Single Page Application (SPA).
        `,
        
        keyPoints: [
            'BrowserRouter vs HashRouter vs MemoryRouter',
            'Componentes Route e Routes para definir rotas',
            'Link e NavLink para navegação declarativa',
            'Parâmetros de rota dinâmicos (:id, :slug)',
            'Query parameters e fragments (#hash)'
        ],
        
        bestPractices: [
            'Use BrowserRouter para aplicações web modernas',
            'Organize rotas de forma hierárquica',
            'Implemente fallback para rotas não encontradas',
            'Use NavLink para indicar rota ativa',
            'Mantenha URLs semânticas e amigáveis'
        ]
    },
    
    /**
     * 🏗️ ROTAS ANINHADAS
     * 
     * Estruturação de rotas complexas com layouts
     */
    nestedRoutes: {
        description: `
            Rotas aninhadas permitem criar layouts complexos onde diferentes 
            partes da interface são renderizadas baseadas na URL, mantendo 
            componentes pai persistentes.
        `,
        
        keyPoints: [
            'Outlet para renderizar rotas filhas',
            'Layouts compartilhados entre rotas',
            'Rotas relativas e absolutas',
            'Index routes para rotas padrão',
            'Pathless routes para agrupamento'
        ],
        
        useCases: [
            'Dashboards com sidebar persistente',
            'Aplicações com header/footer fixos',
            'Seções administrativas',
            'Wizards e formulários multi-etapa',
            'Aplicações com múltiplos layouts'
        ]
    },
    
    /**
     * 🧭 NAVEGAÇÃO PROGRAMÁTICA
     * 
     * Controle de navegação via JavaScript
     */
    programmaticNavigation: {
        description: `
            A navegação programática permite controlar a navegação através 
            de código JavaScript, útil para redirecionamentos condicionais, 
            formulários e ações do usuário.
        `,
        
        hooks: [
            'useNavigate() - navegar programaticamente',
            'useLocation() - acessar informações da URL atual',
            'useParams() - extrair parâmetros da rota',
            'useSearchParams() - gerenciar query parameters'
        ],
        
        patterns: [
            'Redirecionamento após login/logout',
            'Navegação condicional baseada em estado',
            'Histórico de navegação personalizado',
            'Deep linking com estado da aplicação',
            'Breadcrumbs dinâmicos'
        ]
    },
    
    /**
     * 🔒 PROTEÇÃO DE ROTAS
     * 
     * Implementação de guards e autenticação
     */
    routeProtection: {
        description: `
            Guards de rota protegem páginas sensíveis, verificando 
            autenticação, autorização e outras condições antes 
            de permitir acesso.
        `,
        
        strategies: [
            'Higher-Order Components (HOCs)',
            'Componentes wrapper de proteção',
            'Hooks de autenticação',
            'Context API para estado global',
            'Middleware de roteamento'
        ],
        
        implementations: [
            'Verificação de token JWT',
            'Roles e permissões de usuário',
            'Redirecionamento para login',
            'Páginas de acesso negado',
            'Refresh de autenticação'
        ]
    },
    
    /**
     * ⚡ OTIMIZAÇÃO E PERFORMANCE
     * 
     * Técnicas para melhorar performance do roteamento
     */
    performance: {
        description: `
            Otimizações de performance incluem lazy loading, 
            code splitting e preloading para reduzir tempo 
            de carregamento inicial.
        `,
        
        techniques: [
            'React.lazy() para componentes',
            'Suspense para fallbacks de loading',
            'Code splitting por rota',
            'Preloading de rotas críticas',
            'Bundle analysis e otimização'
        ],
        
        benefits: [
            'Redução do bundle inicial',
            'Carregamento sob demanda',
            'Melhor experiência do usuário',
            'Otimização de recursos de rede',
            'Escalabilidade da aplicação'
        ]
    }
};

// =============================================================================
// 10. EXERCÍCIOS PRÁTICOS
// =============================================================================

/**
 * 🎯 EXERCÍCIOS DE ROTEAMENTO
 * 
 * Exercícios práticos para consolidar o aprendizado
 */
const RoutingExercises = {
    
    /**
     * 🟢 EXERCÍCIOS BÁSICOS
     */
    basic: [
        {
            title: "🏠 Configuração Básica de Rotas",
            description: "Configure um sistema básico de roteamento com 3 páginas",
            tasks: [
                "Instalar e configurar React Router DOM",
                "Criar componentes Home, About e Contact",
                "Configurar BrowserRouter com Routes",
                "Implementar navegação com Link",
                "Adicionar rota 404 para páginas não encontradas"
            ],
            difficulty: "Iniciante",
            timeEstimate: "30 minutos"
        },
        
        {
            title: "🧭 Navegação com NavLink",
            description: "Implemente uma barra de navegação com indicação de rota ativa",
            tasks: [
                "Criar componente Navigation",
                "Usar NavLink com classe 'active'",
                "Estilizar links ativos",
                "Adicionar ícones aos links",
                "Implementar navegação responsiva"
            ],
            difficulty: "Iniciante",
            timeEstimate: "45 minutos"
        },
        
        {
            title: "📱 Rotas com Parâmetros",
            description: "Crie rotas dinâmicas para exibir detalhes de itens",
            tasks: [
                "Configurar rota com parâmetro (/user/:id)",
                "Usar useParams para extrair parâmetros",
                "Criar página de detalhes dinâmica",
                "Implementar navegação entre itens",
                "Adicionar validação de parâmetros"
            ],
            difficulty: "Iniciante",
            timeEstimate: "1 hora"
        }
    ],
    
    /**
     * 🟡 EXERCÍCIOS INTERMEDIÁRIOS
     */
    intermediate: [
        {
            title: "🏗️ Rotas Aninhadas com Layout",
            description: "Implemente um dashboard com rotas aninhadas",
            tasks: [
                "Criar layout de dashboard com sidebar",
                "Configurar rotas aninhadas",
                "Usar Outlet para renderizar rotas filhas",
                "Implementar breadcrumbs dinâmicos",
                "Adicionar indicação de rota ativa na sidebar"
            ],
            difficulty: "Intermediário",
            timeEstimate: "2 horas"
        },
        
        {
            title: "🔍 Query Parameters e Filtros",
            description: "Crie sistema de filtros usando query parameters",
            tasks: [
                "Usar useSearchParams para gerenciar filtros",
                "Implementar filtros de busca, categoria e ordenação",
                "Sincronizar filtros com URL",
                "Manter estado dos filtros na navegação",
                "Adicionar funcionalidade de limpar filtros"
            ],
            difficulty: "Intermediário",
            timeEstimate: "1.5 horas"
        },
        
        {
            title: "🧭 Navegação Programática",
            description: "Implemente navegação controlada por lógica",
            tasks: [
                "Usar useNavigate para redirecionamentos",
                "Implementar navegação condicional",
                "Criar histórico de navegação personalizado",
                "Adicionar confirmação antes de sair",
                "Implementar deep linking com estado"
            ],
            difficulty: "Intermediário",
            timeEstimate: "2 horas"
        }
    ],
    
    /**
     * 🔴 EXERCÍCIOS AVANÇADOS
     */
    advanced: [
        {
            title: "🔒 Sistema de Autenticação Completo",
            description: "Implemente autenticação com proteção de rotas",
            tasks: [
                "Criar contexto de autenticação",
                "Implementar login/logout com JWT",
                "Criar componente ProtectedRoute",
                "Adicionar diferentes níveis de permissão",
                "Implementar refresh automático de token"
            ],
            difficulty: "Avançado",
            timeEstimate: "4 horas"
        },
        
        {
            title: "⚡ Lazy Loading e Code Splitting",
            description: "Otimize a aplicação com carregamento sob demanda",
            tasks: [
                "Implementar React.lazy() para componentes",
                "Configurar Suspense com fallbacks",
                "Criar sistema de preloading",
                "Analisar e otimizar bundles",
                "Implementar error boundaries para lazy components"
            ],
            difficulty: "Avançado",
            timeEstimate: "3 horas"
        },
        
        {
            title: "🌐 Roteamento Avançado com Data Loading",
            description: "Implemente carregamento de dados baseado em rotas",
            tasks: [
                "Criar sistema de data loaders",
                "Implementar cache de dados por rota",
                "Adicionar estados de loading e erro",
                "Criar prefetching de dados",
                "Implementar invalidação de cache"
            ],
            difficulty: "Avançado",
            timeEstimate: "5 horas"
        }
    ],
    
    /**
     * 🏆 PROJETO INTEGRADO
     */
    project: {
        title: "🛍️ E-commerce com Roteamento Completo",
        description: "Desenvolva uma aplicação e-commerce completa",
        requirements: [
            "Catálogo de produtos com filtros",
            "Páginas de detalhes com rotas dinâmicas",
            "Carrinho de compras persistente",
            "Sistema de autenticação",
            "Dashboard administrativo",
            "Checkout com múltiplas etapas",
            "Histórico de pedidos",
            "Lazy loading de módulos"
        ],
        features: [
            "Roteamento aninhado para admin",
            "Proteção de rotas por permissão",
            "Query parameters para filtros",
            "Navegação programática no checkout",
            "SEO-friendly URLs",
            "Error boundaries e 404 pages",
            "Loading states e skeleton screens",
            "Breadcrumbs dinâmicos"
        ],
        difficulty: "Projeto Completo",
        timeEstimate: "15-20 horas"
    }
};

// =============================================================================
// 11. RECURSOS ADICIONAIS
// =============================================================================

/**
 * 📚 RECURSOS DE APRENDIZAGEM
 * 
 * Links e materiais para aprofundamento
 */
const RoutingResources = {
    
    /**
     * 📖 DOCUMENTAÇÃO OFICIAL
     */
    documentation: [
        {
            title: "React Router Official Docs",
            url: "https://reactrouter.com/",
            description: "Documentação oficial completa do React Router"
        },
        {
            title: "React Router Tutorial",
            url: "https://reactrouter.com/en/main/start/tutorial",
            description: "Tutorial oficial passo a passo"
        },
        {
            title: "React Router API Reference",
            url: "https://reactrouter.com/en/main/routers/browser-router",
            description: "Referência completa da API"
        }
    ],
    
    /**
     * 🛠️ FERRAMENTAS E BIBLIOTECAS
     */
    tools: [
        {
            name: "React Router DevTools",
            description: "Extensão para debug de rotas",
            usage: "Visualizar árvore de rotas e estado"
        },
        {
            name: "React Location",
            description: "Alternativa moderna ao React Router",
            usage: "Roteamento com foco em performance"
        },
        {
            name: "Reach Router",
            description: "Router acessível (merged com React Router)",
            usage: "Funcionalidades de acessibilidade"
        },
        {
            name: "Next.js Router",
            description: "Sistema de roteamento do Next.js",
            usage: "Roteamento baseado em arquivos"
        }
    ],
    
    /**
     * 🎨 PADRÕES E BOAS PRÁTICAS
     */
    patterns: [
        {
            pattern: "Route-based Code Splitting",
            description: "Dividir código por rotas para otimização",
            implementation: "React.lazy() + Suspense"
        },
        {
            pattern: "Protected Routes HOC",
            description: "Higher-Order Component para proteção",
            implementation: "Wrapper component com verificação"
        },
        {
            pattern: "Layout Routes",
            description: "Rotas com layouts compartilhados",
            implementation: "Outlet + nested routes"
        },
        {
            pattern: "Data Router Pattern",
            description: "Carregamento de dados baseado em rotas",
            implementation: "Loaders + actions"
        }
    ],
    
    /**
     * 📱 BIBLIOTECAS COMPLEMENTARES
     */
    libraries: [
        {
            name: "React Helmet",
            purpose: "Gerenciamento de meta tags",
            usage: "SEO dinâmico baseado em rotas"
        },
        {
            name: "React Transition Group",
            purpose: "Animações entre rotas",
            usage: "Transições suaves na navegação"
        },
        {
            name: "History",
            purpose: "Manipulação do histórico do navegador",
            usage: "Controle avançado de navegação"
        },
        {
            name: "Query String",
            purpose: "Parsing de query parameters",
            usage: "Manipulação avançada de URLs"
        }
    ]
};

// =============================================================================
// 12. RESUMO DO MÓDULO
// =============================================================================

/**
 * 📋 RESUMO COMPLETO
 * 
 * Síntese de tudo que foi abordado no módulo
 */
const ModuleSummary = {
    
    /**
     * 🎯 OBJETIVOS ALCANÇADOS
     */
    objectives: [
        "✅ Configuração e uso básico do React Router DOM",
        "✅ Implementação de rotas dinâmicas com parâmetros",
        "✅ Criação de rotas aninhadas e layouts complexos",
        "✅ Navegação programática com hooks",
        "✅ Sistema de proteção de rotas e autenticação",
        "✅ Otimização com lazy loading e code splitting",
        "✅ Gerenciamento de query parameters",
        "✅ Implementação de guards e middleware"
    ],
    
    /**
     * 🧠 CONCEITOS PRINCIPAIS
     */
    keyConcepts: [
        "Roteamento declarativo vs imperativo",
        "Single Page Application (SPA) navigation",
        "Client-side routing vs server-side routing",
        "Route matching e precedência",
        "History API e browser navigation",
        "Code splitting e performance optimization",
        "Authentication flows em SPAs",
        "SEO considerations para SPAs"
    ],
    
    /**
     * 🛠️ HABILIDADES DESENVOLVIDAS
     */
    skills: [
        "Configurar roteamento em aplicações React",
        "Criar navegação intuitiva e acessível",
        "Implementar autenticação e autorização",
        "Otimizar performance com lazy loading",
        "Gerenciar estado de navegação",
        "Debuggar problemas de roteamento",
        "Implementar SEO-friendly routing",
        "Criar experiências de usuário fluidas"
    ],
    
    /**
     * 🚀 PRÓXIMOS PASSOS
     */
    nextSteps: [
        "📡 Integração com APIs REST (Módulo 2.5)",
        "🧪 Testes de componentes com roteamento",
        "🎨 Animações e transições entre rotas",
        "📱 Roteamento em aplicações mobile (React Native)",
        "🌐 Server-Side Rendering (SSR) com Next.js",
        "🔍 SEO avançado para SPAs",
        "📊 Analytics e tracking de navegação",
        "🚀 Deploy e configuração de servidor"
    ],
    
    /**
     * 💡 DICAS IMPORTANTES
     */
    tips: [
        "Sempre use BrowserRouter para aplicações web modernas",
        "Implemente fallbacks para rotas não encontradas",
        "Use lazy loading para rotas pesadas",
        "Mantenha URLs semânticas e amigáveis",
        "Teste a navegação em diferentes dispositivos",
        "Considere acessibilidade na navegação",
        "Monitore performance de carregamento",
        "Documente a estrutura de rotas da aplicação"
    ]
};

/**
 * 🎓 CONCLUSÃO DO MÓDULO
 */
console.log(`
🎉 MÓDULO 2.4 CONCLUÍDO: ROTAS E NAVEGAÇÃO COM REACT ROUTER

📚 Neste módulo você aprendeu:
• Configuração e uso do React Router DOM
• Implementação de rotas dinâmicas e aninhadas
• Navegação programática e hooks de roteamento
• Proteção de rotas e sistemas de autenticação
• Otimização com lazy loading e code splitting
• Gerenciamento de query parameters e estado de navegação

🚀 Próximo módulo: Integração com APIs REST
💡 Continue praticando os exercícios para consolidar o aprendizado!
`);

// Inicializar aplicação se estiver no navegador
if (typeof window !== 'undefined') {
    // Aguardar carregamento do DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRoutingApp);
    } else {
        initRoutingApp();
    }
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppWithRouter,
        Navigation,
        HomePage,
        AboutPage,
        ProductsPage,
        ProductDetailPage,
        DashboardLayout,
        RouterHooks,
        AuthSystem,
        ProtectedRoute,
        LazyLoader,
        RoutingConcepts,
        RoutingExercises,
        RoutingResources,
        ModuleSummary,
        initRoutingApp
    };
}