/*
=============================================================================
                    MÓDULO 1: FUNDAMENTOS DE DESENVOLVIMENTO FRONTEND
                           01 - FUNDAMENTOS MODERNOS
=============================================================================

📚 OBJETIVOS DE APRENDIZAGEM:
• Dominar HTML5 semântico e acessibilidade
• Aplicar CSS3 avançado (Grid, Flexbox, Custom Properties)
• Utilizar JavaScript ES6+ e APIs modernas
• Implementar Responsive Design e Mobile First
• Compreender performance e otimização frontend

🎯 COMPETÊNCIAS DESENVOLVIDAS:
• Estruturação semântica de documentos
• Layout responsivo e acessível
• Programação JavaScript moderna
• Otimização de performance
• Boas práticas de desenvolvimento

⏱️ TEMPO ESTIMADO: 6 horas

=============================================================================
*/

// =============================================================================
// 1. HTML5 SEMÂNTICO E ACESSIBILIDADE
// =============================================================================

/**
 * 🏗️ ESTRUTURA SEMÂNTICA MODERNA
 * 
 * O HTML5 introduziu elementos semânticos que melhoram:
 * - SEO (Search Engine Optimization)
 * - Acessibilidade para leitores de tela
 * - Manutenibilidade do código
 * - Performance de renderização
 */

class SemanticHTMLBuilder {
    constructor() {
        this.document = null;
        this.accessibilityFeatures = new Set();
    }

    /**
     * Cria uma estrutura HTML5 semântica completa
     */
    createSemanticStructure() {
        const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Aplicação web moderna com HTML5 semântico">
    <title>App Moderno - Desenvolvimento Web</title>
    
    <!-- Preload de recursos críticos -->
    <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/css/critical.css" as="style">
    
    <!-- CSS crítico inline para performance -->
    <style>
        /* Critical CSS aqui */
        body { font-family: system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body>
    <!-- Skip link para acessibilidade -->
    <a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>
    
    <!-- Header semântico -->
    <header role="banner">
        <nav role="navigation" aria-label="Navegação principal">
            <h1>Logo da Empresa</h1>
            <ul role="menubar">
                <li role="none"><a href="#" role="menuitem">Home</a></li>
                <li role="none"><a href="#" role="menuitem">Sobre</a></li>
                <li role="none"><a href="#" role="menuitem">Contato</a></li>
            </ul>
        </nav>
    </header>
    
    <!-- Conteúdo principal -->
    <main id="main-content" role="main">
        <section aria-labelledby="hero-title">
            <h2 id="hero-title">Bem-vindo ao Futuro</h2>
            <p>Conteúdo principal da aplicação</p>
        </section>
        
        <section aria-labelledby="features-title">
            <h2 id="features-title">Funcionalidades</h2>
            <article>
                <h3>Feature 1</h3>
                <p>Descrição da funcionalidade</p>
            </article>
        </section>
    </main>
    
    <!-- Sidebar complementar -->
    <aside role="complementary" aria-label="Informações adicionais">
        <h2>Sidebar</h2>
        <p>Conteúdo complementar</p>
    </aside>
    
    <!-- Footer -->
    <footer role="contentinfo">
        <p>&copy; 2024 Empresa. Todos os direitos reservados.</p>
    </footer>
</body>
</html>`;
        
        return template;
    }

    /**
     * Adiciona recursos de acessibilidade avançados
     */
    addAccessibilityFeatures() {
        const features = {
            // ARIA Labels e Descriptions
            ariaLabels: {
                searchForm: 'aria-label="Formulário de busca"',
                navigation: 'aria-label="Navegação principal"',
                breadcrumb: 'aria-label="Você está aqui"'
            },

            // Live Regions para atualizações dinâmicas
            liveRegions: {
                status: '<div aria-live="polite" aria-atomic="true" id="status-messages"></div>',
                alerts: '<div aria-live="assertive" aria-atomic="true" id="error-messages"></div>'
            },

            // Focus Management
            focusManagement: {
                skipLinks: '<a href="#main" class="skip-link">Pular para conteúdo</a>',
                focusTrap: 'data-focus-trap="true"',
                tabIndex: 'tabindex="-1"' // Para elementos que precisam receber foco programaticamente
            },

            // Keyboard Navigation
            keyboardSupport: {
                dropdown: 'role="button" aria-haspopup="true" aria-expanded="false"',
                modal: 'role="dialog" aria-modal="true" aria-labelledby="modal-title"',
                tabs: 'role="tablist" aria-orientation="horizontal"'
            }
        };

        this.accessibilityFeatures.add('WCAG 2.1 AA Compliant');
        return features;
    }

    /**
     * Valida a estrutura semântica
     */
    validateSemanticStructure(htmlString) {
        const validation = {
            hasDoctype: /<!DOCTYPE html>/i.test(htmlString),
            hasLang: /html lang=/i.test(htmlString),
            hasViewport: /viewport/i.test(htmlString),
            hasSemanticElements: {
                header: /<header/i.test(htmlString),
                nav: /<nav/i.test(htmlString),
                main: /<main/i.test(htmlString),
                section: /<section/i.test(htmlString),
                article: /<article/i.test(htmlString),
                aside: /<aside/i.test(htmlString),
                footer: /<footer/i.test(htmlString)
            },
            hasAccessibility: {
                skipLinks: /skip-link/i.test(htmlString),
                ariaLabels: /aria-label/i.test(htmlString),
                roles: /role=/i.test(htmlString)
            }
        };

        const score = this.calculateSemanticScore(validation);
        return { validation, score };
    }

    calculateSemanticScore(validation) {
        let score = 0;
        const maxScore = 100;

        // Básicos (30 pontos)
        if (validation.hasDoctype) score += 10;
        if (validation.hasLang) score += 10;
        if (validation.hasViewport) score += 10;

        // Elementos semânticos (40 pontos)
        const semanticCount = Object.values(validation.hasSemanticElements)
            .filter(Boolean).length;
        score += (semanticCount / 7) * 40;

        // Acessibilidade (30 pontos)
        const accessibilityCount = Object.values(validation.hasAccessibility)
            .filter(Boolean).length;
        score += (accessibilityCount / 3) * 30;

        return Math.round(score);
    }
}

// =============================================================================
// 2. CSS3 AVANÇADO - GRID, FLEXBOX E CUSTOM PROPERTIES
// =============================================================================

/**
 * 🎨 SISTEMA DE LAYOUT MODERNO
 * 
 * Combina CSS Grid, Flexbox e Custom Properties para criar
 * layouts flexíveis, responsivos e maintíveis
 */

class ModernCSSSystem {
    constructor() {
        this.customProperties = new Map();
        this.gridTemplates = new Map();
        this.flexboxPatterns = new Map();
        this.mediaQueries = new Map();
    }

    /**
     * Define Custom Properties (CSS Variables) para design system
     */
    createDesignSystem() {
        const designTokens = `
:root {
  /* === CORES === */
  --color-primary: hsl(220, 90%, 56%);
  --color-primary-light: hsl(220, 90%, 70%);
  --color-primary-dark: hsl(220, 90%, 40%);
  
  --color-secondary: hsl(280, 70%, 60%);
  --color-accent: hsl(45, 100%, 60%);
  
  --color-neutral-100: hsl(0, 0%, 98%);
  --color-neutral-200: hsl(0, 0%, 90%);
  --color-neutral-300: hsl(0, 0%, 80%);
  --color-neutral-800: hsl(0, 0%, 20%);
  --color-neutral-900: hsl(0, 0%, 10%);
  
  /* === TIPOGRAFIA === */
  --font-family-primary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'Fira Code', 'Consolas', monospace;
  
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --font-size-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --font-size-3xl: clamp(2rem, 1.7rem + 1.5vw, 3rem);
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* === ESPAÇAMENTO === */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  
  /* === LAYOUT === */
  --container-max-width: 1200px;
  --container-padding: var(--space-md);
  
  --grid-gap: var(--space-md);
  --grid-columns: 12;
  
  /* === BORDAS E SOMBRAS === */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  --border-radius-full: 9999px;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* === TRANSIÇÕES === */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
  
  /* === Z-INDEX === */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-popover: 1050;
  --z-tooltip: 1060;
}

/* === DARK MODE === */
@media (prefers-color-scheme: dark) {
  :root {
    --color-neutral-100: hsl(0, 0%, 10%);
    --color-neutral-200: hsl(0, 0%, 15%);
    --color-neutral-300: hsl(0, 0%, 25%);
    --color-neutral-800: hsl(0, 0%, 85%);
    --color-neutral-900: hsl(0, 0%, 95%);
  }
}

/* === REDUCED MOTION === */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-normal: 0ms;
    --transition-slow: 0ms;
  }
  
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`;

        return designTokens;
    }

    /**
     * Cria sistema de Grid CSS moderno
     */
    createGridSystem() {
        const gridCSS = `
/* === CONTAINER PRINCIPAL === */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin-inline: auto;
  padding-inline: var(--container-padding);
}

/* === GRID LAYOUT === */
.grid {
  display: grid;
  gap: var(--grid-gap);
}

/* === GRID TEMPLATES === */
.grid-auto {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* === LAYOUT COMPLEXO === */
.layout-main {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 250px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: var(--space-md);
}

.layout-header { grid-area: header; }
.layout-sidebar { grid-area: sidebar; }
.layout-main-content { grid-area: main; }
.layout-aside { grid-area: aside; }
.layout-footer { grid-area: footer; }

/* === RESPONSIVO === */
@media (max-width: 768px) {
  .layout-main {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
  
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid-3,
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* === GRID UTILITIES === */
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }
.col-span-4 { grid-column: span 4; }
.col-span-full { grid-column: 1 / -1; }

.row-span-2 { grid-row: span 2; }
.row-span-3 { grid-row: span 3; }

.place-center { place-items: center; }
.place-start { place-items: start; }
.place-end { place-items: end; }`;

        return gridCSS;
    }

    /**
     * Cria sistema Flexbox para componentes
     */
    createFlexboxSystem() {
        const flexCSS = `
/* === FLEX CONTAINERS === */
.flex {
  display: flex;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

/* === JUSTIFY CONTENT === */
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }

/* === ALIGN ITEMS === */
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }
.items-baseline { align-items: baseline; }

/* === FLEX GROW/SHRINK === */
.flex-1 { flex: 1 1 0%; }
.flex-auto { flex: 1 1 auto; }
.flex-initial { flex: 0 1 auto; }
.flex-none { flex: none; }

.grow { flex-grow: 1; }
.grow-0 { flex-grow: 0; }

.shrink { flex-shrink: 1; }
.shrink-0 { flex-shrink: 0; }

/* === GAP === */
.gap-xs { gap: var(--space-xs); }
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
.gap-lg { gap: var(--space-lg); }
.gap-xl { gap: var(--space-xl); }

/* === PADRÕES COMUNS === */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-col-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}`;

        return flexCSS;
    }

    /**
     * Cria sistema de componentes reutilizáveis
     */
    createComponentSystem() {
        const componentCSS = `
/* === BOTÕES === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-secondary:hover {
  background-color: var(--color-primary);
  color: white;
}

/* === CARDS === */
.card {
  background-color: var(--color-neutral-100);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-neutral-200);
}

.card-body {
  padding: var(--space-lg);
}

.card-footer {
  padding: var(--space-lg);
  border-top: 1px solid var(--color-neutral-200);
  background-color: var(--color-neutral-100);
}

/* === FORMULÁRIOS === */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-neutral-800);
}

.form-input {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgb(var(--color-primary) / 0.1);
}

/* === NAVEGAÇÃO === */
.nav {
  display: flex;
  gap: var(--space-md);
}

.nav-link {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-neutral-800);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.nav-link:hover,
.nav-link.active {
  background-color: var(--color-primary);
  color: white;
}`;

        return componentCSS;
    }

    /**
     * Gera CSS completo do sistema
     */
    generateCompleteCSS() {
        return [
            this.createDesignSystem(),
            this.createGridSystem(),
            this.createFlexboxSystem(),
            this.createComponentSystem()
        ].join('\n\n');
    }
}

// =============================================================================
// 3. JAVASCRIPT ES6+ E APIS MODERNAS
// =============================================================================

/**
 * 🚀 JAVASCRIPT MODERNO E APIS
 * 
 * Demonstra o uso de features ES6+ e APIs modernas do navegador
 * para criar aplicações performáticas e interativas
 */

class ModernJavaScript {
    constructor() {
        this.observers = new Map();
        this.cache = new Map();
        this.abortControllers = new Map();
    }

    /**
     * Demonstra features ES6+ essenciais
     */
    demonstrateES6Features() {
        // === DESTRUCTURING E SPREAD === //
        const user = {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            preferences: {
                theme: 'dark',
                language: 'pt-BR'
            }
        };

        // Destructuring com renomeação e valores padrão
        const {
            name: userName,
            email,
            preferences: { theme = 'light', language = 'en' } = {},
            avatar = '/default-avatar.png'
        } = user;

        console.log('Destructuring:', { userName, email, theme, language, avatar });

        // Spread para clonagem e merge
        const updatedUser = {
            ...user,
            preferences: {
                ...user.preferences,
                notifications: true
            },
            lastLogin: new Date()
        };

        console.log('Updated user:', updatedUser);

        // === TEMPLATE LITERALS AVANÇADOS === //
        const createUserCard = (user) => {
            return `
                <div class="user-card" data-user-id="${user.id}">
                    <img src="${user.avatar || '/default-avatar.png'}" 
                         alt="Avatar de ${user.name}" 
                         loading="lazy">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                    <div class="preferences">
                        <span>Tema: ${user.preferences?.theme || 'padrão'}</span>
                        <span>Idioma: ${user.preferences?.language || 'pt-BR'}</span>
                    </div>
                </div>
            `;
        };

        // === ARROW FUNCTIONS E MÉTODOS DE ARRAY === //
        const users = [
            { id: 1, name: 'João', age: 25, active: true },
            { id: 2, name: 'Maria', age: 30, active: false },
            { id: 3, name: 'Pedro', age: 35, active: true }
        ];

        // Encadeamento de métodos
        const activeUserNames = users
            .filter(user => user.active)
            .map(user => user.name.toUpperCase())
            .sort();

        console.log('Active users:', activeUserNames);

        // === ASYNC/AWAIT COM ERROR HANDLING === //
        const fetchUserData = async (userId) => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const userData = await response.json();
                return { success: true, data: userData };
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                return { success: false, error: error.message };
            }
        };

        // === CLASSES E HERANÇA === //
        class Component {
            constructor(element) {
                this.element = element;
                this.state = new Proxy({}, {
                    set: (target, property, value) => {
                        target[property] = value;
                        this.render();
                        return true;
                    }
                });
            }

            render() {
                // Implementação base
                console.log('Renderizando componente...');
            }

            destroy() {
                this.element?.remove();
            }
        }

        class Button extends Component {
            constructor(element, options = {}) {
                super(element);
                this.options = { variant: 'primary', ...options };
                this.setupEventListeners();
            }

            setupEventListeners() {
                this.element?.addEventListener('click', this.handleClick.bind(this));
            }

            handleClick(event) {
                event.preventDefault();
                this.options.onClick?.(event);
            }

            render() {
                if (!this.element) return;
                
                this.element.className = `btn btn-${this.options.variant}`;
                this.element.textContent = this.state.text || this.options.text || 'Button';
            }
        }

        return {
            createUserCard,
            fetchUserData,
            Button,
            activeUserNames
        };
    }

    /**
     * Demonstra APIs modernas do navegador
     */
    demonstrateModernAPIs() {
        // === INTERSECTION OBSERVER === //
        const createLazyLoader = () => {
            const imageObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    });
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                }
            );

            // Observar todas as imagens lazy
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            return imageObserver;
        };

        // === RESIZE OBSERVER === //
        const createResponsiveHandler = () => {
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const { width } = entry.contentRect;
                    const element = entry.target;
                    
                    // Aplicar classes baseadas no tamanho
                    element.classList.toggle('is-small', width < 300);
                    element.classList.toggle('is-medium', width >= 300 && width < 600);
                    element.classList.toggle('is-large', width >= 600);
                });
            });

            return resizeObserver;
        };

        // === WEB WORKERS === //
        const createWebWorker = () => {
            const workerCode = `
                self.onmessage = function(e) {
                    const { type, data } = e.data;
                    
                    switch(type) {
                        case 'HEAVY_CALCULATION':
                            const result = performHeavyCalculation(data);
                            self.postMessage({ type: 'CALCULATION_RESULT', result });
                            break;
                        
                        case 'PROCESS_DATA':
                            const processed = processLargeDataSet(data);
                            self.postMessage({ type: 'DATA_PROCESSED', processed });
                            break;
                    }
                };
                
                function performHeavyCalculation(numbers) {
                    return numbers.reduce((acc, num) => acc + Math.sqrt(num), 0);
                }
                
                function processLargeDataSet(data) {
                    return data.map(item => ({
                        ...item,
                        processed: true,
                        timestamp: Date.now()
                    }));
                }
            `;

            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));

            return {
                worker,
                calculate: (numbers) => {
                    return new Promise((resolve) => {
                        worker.onmessage = (e) => {
                            if (e.data.type === 'CALCULATION_RESULT') {
                                resolve(e.data.result);
                            }
                        };
                        worker.postMessage({ type: 'HEAVY_CALCULATION', data: numbers });
                    });
                },
                terminate: () => worker.terminate()
            };
        };

        // === SERVICE WORKER === //
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('Service Worker registrado:', registration);
                    
                    // Escutar atualizações
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Nova versão disponível
                                this.showUpdateNotification();
                            }
                        });
                    });
                    
                    return registration;
                } catch (error) {
                    console.error('Erro ao registrar Service Worker:', error);
                }
            }
        };

        // === CACHE API === //
        const createCacheManager = () => {
            return {
                async cache(request, response) {
                    const cache = await caches.open('app-cache-v1');
                    await cache.put(request, response.clone());
                    return response;
                },

                async getCached(request) {
                    const cache = await caches.open('app-cache-v1');
                    return await cache.match(request);
                },

                async fetchWithCache(url, options = {}) {
                    const request = new Request(url, options);
                    
                    // Tentar cache primeiro
                    const cached = await this.getCached(request);
                    if (cached && !options.forceRefresh) {
                        return cached;
                    }
                    
                    // Buscar da rede
                    try {
                        const response = await fetch(request);
                        if (response.ok) {
                            await this.cache(request, response);
                        }
                        return response;
                    } catch (error) {
                        // Fallback para cache se rede falhar
                        return cached || Promise.reject(error);
                    }
                }
            };
        };

        return {
            createLazyLoader,
            createResponsiveHandler,
            createWebWorker,
            registerServiceWorker,
            createCacheManager
        };
    }

    /**
     * Sistema de notificações moderno
     */
    showUpdateNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Atualização Disponível', {
                body: 'Uma nova versão da aplicação está disponível.',
                icon: '/icon-192.png',
                badge: '/badge-72.png',
                actions: [
                    { action: 'update', title: 'Atualizar Agora' },
                    { action: 'later', title: 'Mais Tarde' }
                ]
            });
        }
    }
}

// =============================================================================
// 4. RESPONSIVE DESIGN E MOBILE FIRST
// =============================================================================

/**
 * 📱 SISTEMA RESPONSIVO MODERNO
 * 
 * Implementa estratégias Mobile First com breakpoints inteligentes
 * e componentes adaptativos
 */

class ResponsiveDesignSystem {
    constructor() {
        this.breakpoints = {
            xs: '0px',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            xxl: '1400px'
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.setupBreakpointListener();
    }

    /**
     * Cria sistema de breakpoints Mobile First
     */
    createBreakpointSystem() {
        const breakpointCSS = `
/* === MOBILE FIRST BREAKPOINTS === */

/* Base: Mobile (0px+) */
.container {
  width: 100%;
  padding-inline: 1rem;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.text-size {
  font-size: clamp(1rem, 4vw, 1.125rem);
}

/* Small devices (576px+) */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
    margin-inline: auto;
  }
  
  .grid-sm-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .text-sm-left { text-align: left; }
  .text-sm-center { text-align: center; }
  .text-sm-right { text-align: right; }
}

/* Medium devices (768px+) */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    padding-inline: 1.5rem;
  }
  
  .grid-md-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .grid-md-sidebar {
    grid-template-columns: 250px 1fr;
  }
  
  .hidden-md { display: none; }
  .visible-md { display: block; }
}

/* Large devices (992px+) */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
  
  .grid-lg-4 {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .grid-lg-complex {
    grid-template-columns: 200px 1fr 300px;
  }
}

/* Extra large devices (1200px+) */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
  
  .grid-xl-5 {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* Extra extra large devices (1400px+) */
@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}`;

        return breakpointCSS;
    }

    /**
     * Detecta breakpoint atual
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= 1400) return 'xxl';
        if (width >= 1200) return 'xl';
        if (width >= 992) return 'lg';
        if (width >= 768) return 'md';
        if (width >= 576) return 'sm';
        return 'xs';
    }

    /**
     * Configura listener para mudanças de breakpoint
     */
    setupBreakpointListener() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newBreakpoint = this.getCurrentBreakpoint();
                
                if (newBreakpoint !== this.currentBreakpoint) {
                    this.currentBreakpoint = newBreakpoint;
                    this.onBreakpointChange(newBreakpoint);
                }
            }, 100);
        });
    }

    /**
     * Callback para mudanças de breakpoint
     */
    onBreakpointChange(breakpoint) {
        document.body.setAttribute('data-breakpoint', breakpoint);
        
        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('breakpointChange', {
            detail: { breakpoint, width: window.innerWidth }
        }));
        
        console.log(`Breakpoint changed to: ${breakpoint}`);
    }

    /**
     * Cria componentes adaptativos
     */
    createAdaptiveComponents() {
        // === NAVEGAÇÃO ADAPTATIVA === //
        class AdaptiveNavigation {
            constructor(element) {
                this.element = element;
                this.isMobile = window.innerWidth < 768;
                this.isOpen = false;
                
                this.setupNavigation();
                this.setupBreakpointListener();
            }

            setupNavigation() {
                const template = `
                    <nav class="adaptive-nav" role="navigation">
                        <div class="nav-brand">
                            <a href="/" class="brand-link">Logo</a>
                        </div>
                        
                        <button class="nav-toggle" 
                                aria-label="Abrir menu de navegação"
                                aria-expanded="false">
                            <span class="hamburger"></span>
                            <span class="hamburger"></span>
                            <span class="hamburger"></span>
                        </button>
                        
                        <div class="nav-menu" role="menubar">
                            <a href="#" class="nav-link" role="menuitem">Home</a>
                            <a href="#" class="nav-link" role="menuitem">Sobre</a>
                            <a href="#" class="nav-link" role="menuitem">Serviços</a>
                            <a href="#" class="nav-link" role="menuitem">Contato</a>
                        </div>
                    </nav>
                `;
                
                this.element.innerHTML = template;
                this.setupEventListeners();
            }

            setupEventListeners() {
                const toggle = this.element.querySelector('.nav-toggle');
                const menu = this.element.querySelector('.nav-menu');
                
                toggle?.addEventListener('click', () => {
                    this.isOpen = !this.isOpen;
                    toggle.setAttribute('aria-expanded', this.isOpen);
                    menu?.classList.toggle('is-open', this.isOpen);
                });
                
                // Fechar menu ao clicar em link (mobile)
                this.element.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        if (this.isMobile) {
                            this.isOpen = false;
                            toggle.setAttribute('aria-expanded', false);
                            menu?.classList.remove('is-open');
                        }
                    });
                });
            }

            setupBreakpointListener() {
                window.addEventListener('breakpointChange', (e) => {
                    this.isMobile = e.detail.width < 768;
                    
                    if (!this.isMobile && this.isOpen) {
                        this.isOpen = false;
                        const toggle = this.element.querySelector('.nav-toggle');
                        const menu = this.element.querySelector('.nav-menu');
                        
                        toggle?.setAttribute('aria-expanded', false);
                        menu?.classList.remove('is-open');
                    }
                });
            }
        }

        // === GRID ADAPTATIVO === //
        class AdaptiveGrid {
            constructor(element, options = {}) {
                this.element = element;
                this.options = {
                    minItemWidth: 250,
                    gap: 16,
                    ...options
                };
                
                this.setupGrid();
                this.setupResizeObserver();
            }

            setupGrid() {
                this.element.style.display = 'grid';
                this.element.style.gap = `${this.options.gap}px`;
                this.updateGridColumns();
            }

            updateGridColumns() {
                const containerWidth = this.element.offsetWidth;
                const availableWidth = containerWidth - (this.options.gap * 2);
                const columns = Math.floor(availableWidth / this.options.minItemWidth) || 1;
                
                this.element.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            }

            setupResizeObserver() {
                const resizeObserver = new ResizeObserver(() => {
                    this.updateGridColumns();
                });
                
                resizeObserver.observe(this.element);
            }
        }

        return {
            AdaptiveNavigation,
            AdaptiveGrid
        };
    }

    /**
     * Cria CSS para componentes adaptativos
     */
    createAdaptiveCSS() {
        return `
/* === NAVEGAÇÃO ADAPTATIVA === */
.adaptive-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-brand .brand-link {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: var(--color-primary);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  width: 25px;
  height: 3px;
  background: var(--color-neutral-800);
  margin: 3px 0;
  transition: 0.3s;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--color-neutral-800);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--color-primary);
}

/* Mobile */
@media (max-width: 767px) {
  .nav-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-menu.is-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-toggle[aria-expanded="true"] .hamburger:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }
  
  .nav-toggle[aria-expanded="true"] .hamburger:nth-child(2) {
    opacity: 0;
  }
  
  .nav-toggle[aria-expanded="true"] .hamburger:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }
}

/* === IMAGENS RESPONSIVAS === */
.responsive-img {
  max-width: 100%;
  height: auto;
  display: block;
}

.aspect-ratio {
  position: relative;
  overflow: hidden;
}

.aspect-ratio::before {
  content: '';
  display: block;
  padding-top: var(--aspect-ratio, 56.25%); /* 16:9 por padrão */
}

.aspect-ratio > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* === TIPOGRAFIA RESPONSIVA === */
.responsive-text {
  font-size: clamp(1rem, 2.5vw, 2rem);
  line-height: 1.4;
}

.responsive-heading {
  font-size: clamp(1.5rem, 5vw, 3rem);
  line-height: 1.2;
}

/* === ESPAÇAMENTO RESPONSIVO === */
.responsive-spacing {
  padding: clamp(1rem, 5vw, 3rem);
  margin-bottom: clamp(1rem, 3vw, 2rem);
}`;
    }
}

// =============================================================================
// 5. EXERCÍCIO PRÁTICO: LANDING PAGE MODERNA
// =============================================================================

/**
 * 🎯 EXERCÍCIO PRÁTICO
 * 
 * Criar uma landing page moderna que demonstre todos os conceitos aprendidos:
 * - HTML5 semântico e acessível
 * - CSS Grid e Flexbox
 * - JavaScript ES6+ e APIs modernas
 * - Design responsivo Mobile First
 */

class ModernLandingPage {
    constructor() {
        this.components = new Map();
        this.observers = new Map();
        this.init();
    }

    /**
     * Inicializa a landing page
     */
    async init() {
        await this.loadComponents();
        this.setupIntersectionObserver();
        this.setupFormHandling();
        this.setupPerformanceMonitoring();
        
        console.log('Landing page inicializada com sucesso!');
    }

    /**
     * Carrega todos os componentes da página
     */
    async loadComponents() {
        // Componentes a serem carregados
        const componentLoaders = [
            this.createHeader(),
            this.createHeroSection(),
            this.createFeaturesSection(),
            this.createTestimonialsSection(),
            this.createContactForm(),
            this.createFooter()
        ];

        // Carregar componentes em paralelo
        const components = await Promise.all(componentLoaders);
        
        components.forEach((component, index) => {
            this.components.set(`component-${index}`, component);
        });
    }

    /**
     * Cria o header da página
     */
    createHeader() {
        return new Promise((resolve) => {
            const header = document.createElement('header');
            header.innerHTML = `
                <nav class="navbar" role="navigation" aria-label="Navegação principal">
                    <div class="container">
                        <div class="navbar-brand">
                            <a href="#" class="brand-link">
                                <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
                                    <circle cx="20" cy="20" r="18" fill="var(--color-primary)"/>
                                    <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">M</text>
                                </svg>
                                <span>ModernWeb</span>
                            </a>
                        </div>
                        
                        <button class="navbar-toggle" 
                                aria-label="Abrir menu de navegação"
                                aria-expanded="false"
                                aria-controls="navbar-menu">
                            <span class="sr-only">Menu</span>
                            <div class="hamburger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                        
                        <div class="navbar-menu" id="navbar-menu">
                            <ul class="navbar-nav" role="menubar">
                                <li role="none">
                                    <a href="#features" class="nav-link" role="menuitem">Funcionalidades</a>
                                </li>
                                <li role="none">
                                    <a href="#testimonials" class="nav-link" role="menuitem">Depoimentos</a>
                                </li>
                                <li role="none">
                                    <a href="#contact" class="nav-link" role="menuitem">Contato</a>
                                </li>
                                <li role="none">
                                    <a href="#" class="btn btn-primary" role="menuitem">Começar Agora</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            `;
            
            this.setupNavigation(header);
            resolve(header);
        });
    }

    /**
     * Cria a seção hero
     */
    createHeroSection() {
        return new Promise((resolve) => {
            const hero = document.createElement('section');
            hero.className = 'hero';
            hero.innerHTML = `
                <div class="container">
                    <div class="hero-content">
                        <div class="hero-text">
                            <h1 class="hero-title">
                                Desenvolvimento Web
                                <span class="highlight">Moderno</span>
                            </h1>
                            <p class="hero-description">
                                Aprenda as tecnologias mais demandadas do mercado e 
                                construa aplicações web incríveis com React, Node.js e TypeScript.
                            </p>
                            <div class="hero-actions">
                                <a href="#contact" class="btn btn-primary btn-lg">
                                    Começar Agora
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                                    </svg>
                                </a>
                                <a href="#features" class="btn btn-secondary btn-lg">
                                    Saiba Mais
                                </a>
                            </div>
                        </div>
                        
                        <div class="hero-visual">
                            <div class="code-preview">
                                <div class="code-header">
                                    <div class="code-dots">
                                        <span class="dot red"></span>
                                        <span class="dot yellow"></span>
                                        <span class="dot green"></span>
                                    </div>
                                    <span class="code-title">App.tsx</span>
                                </div>
                                <div class="code-content">
                                    <pre><code class="language-tsx">
import React from 'react';
import { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    &lt;div className="app"&gt;
      &lt;h1&gt;Modern Web App&lt;/h1&gt;
      &lt;button onClick={() => setCount(c => c + 1)}&gt;
        Count: {count}
      &lt;/button&gt;
    &lt;/div&gt;
  );
}

export default App;
                                    </code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.setupCodeAnimation(hero);
            resolve(hero);
        });
    }

    /**
     * Configura animação do código
     */
    setupCodeAnimation(heroElement) {
        const codeElement = heroElement.querySelector('code');
        if (!codeElement) return;

        // Simular digitação do código
        const originalText = codeElement.textContent;
        codeElement.textContent = '';
        
        let index = 0;
        const typeSpeed = 30;
        
        const typeWriter = () => {
            if (index < originalText.length) {
                codeElement.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            }
        };
        
        // Iniciar animação quando elemento estiver visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 1000);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(heroElement);
    }

    /**
     * Configura navegação responsiva
     */
    setupNavigation(header) {
        const toggle = header.querySelector('.navbar-toggle');
        const menu = header.querySelector('.navbar-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', () => {
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            
            toggle.setAttribute('aria-expanded', !isOpen);
            menu.classList.toggle('is-open', !isOpen);
            
            // Gerenciar foco
            if (!isOpen) {
                const firstLink = menu.querySelector('.nav-link');
                firstLink?.focus();
            }
        });
        
        // Fechar menu ao clicar em links (mobile)
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('is-open');
                }
            });
        });
        
        // Smooth scroll para links internos
        menu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Configura Intersection Observer para animações
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos com classe 'animate-on-scroll'
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        this.observers.set('intersection', observer);
    }

    /**
     * Configura manipulação de formulários
     */
    setupFormHandling() {
        const forms = document.querySelectorAll('form[data-ajax]');
        
        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmission(form);
            });
        });
    }

    /**
     * Manipula envio de formulário via AJAX
     */
    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton?.textContent;
        
        try {
            // Mostrar estado de carregamento
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }
            
            // Simular envio (substituir por endpoint real)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mostrar sucesso
            this.showNotification('Mensagem enviada com sucesso!', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            // Restaurar botão
            if (submitButton && originalText) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    }

    /**
     * Mostra notificação para o usuário
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Fechar notificação">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Configurar fechamento
        const closeButton = notification.querySelector('.notification-close');
        closeButton?.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Configura monitoramento de performance
     */
    setupPerformanceMonitoring() {
        // Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay (FID)
            new PerformanceObserver((entryList) => {
                entryList.getEntries().forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            new PerformanceObserver((entryList) => {
                entryList.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log('CLS:', clsValue);
                    }
                });
            }).observe({ entryTypes: ['layout-shift'] });
        }
        
        // Monitorar recursos
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Performance Metrics:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        });
    }
}

// =============================================================================
// 6. CSS COMPLETO PARA A LANDING PAGE
// =============================================================================

/**
 * 🎨 ESTILOS COMPLETOS
 * 
 * CSS moderno usando todas as técnicas aprendidas
 */

const LANDING_PAGE_CSS = `
/* === RESET E BASE === */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-800);
  background-color: var(--color-neutral-100);
}

/* === ACESSIBILIDADE === */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: var(--z-tooltip);
}

.skip-link:focus {
  top: 6px;
}

/* === ANIMAÇÕES === */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* === HEADER E NAVEGAÇÃO === */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-neutral-200);
  z-index: var(--z-fixed);
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-neutral-900);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.navbar-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: var(--color-neutral-800);
  transition: all 0.3s ease;
}

.navbar-menu {
  display: flex;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
}

.nav-link {
  text-decoration: none;
  color: var(--color-neutral-700);
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-primary);
}

/* === HERO SECTION === */
.hero {
  padding: 8rem 0 4rem;
  background: linear-gradient(135deg, 
    var(--color-neutral-100) 0%, 
    var(--color-primary-light) 100%);
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: 1.5rem;
}

.highlight {
  color: var(--color-primary);
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-accent);
  border-radius: 2px;
}

.hero-description {
  font-size: var(--font-size-lg);
  color: var(--color-neutral-600);
  margin-bottom: 2rem;
  line-height: var(--line-height-relaxed);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* === CODE PREVIEW === */
.code-preview {
  background: var(--color-neutral-900);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: transform var(--transition-normal);
}

.code-preview:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-neutral-800);
  border-bottom: 1px solid var(--color-neutral-700);
}

.code-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27ca3f; }

.code-title {
  color: var(--color-neutral-300);
  font-size: var(--font-size-sm);
}

.code-content {
  padding: 1.5rem;
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-neutral-200);
}

/* === NOTIFICAÇÕES === */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  max-width: 400px;
  background: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-tooltip);
  animation: fadeInLeft 0.3s ease;
}

.notification-success {
  border-left: 4px solid #10b981;
}

.notification-error {
  border-left: 4px solid #ef4444;
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-neutral-500);
  padding: 0.25rem;
}

/* === RESPONSIVO === */
@media (max-width: 767px) {
  .navbar-toggle {
    display: flex;
  }
  
  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid var(--color-neutral-200);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .navbar-menu.is-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .navbar-nav {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  
  .hero {
    padding: 6rem 0 3rem;
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .code-preview {
    transform: none;
    margin-top: 2rem;
  }
  
  .notification {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
`;

// =============================================================================
// 7. INICIALIZAÇÃO E DEMONSTRAÇÃO
// =============================================================================

/**
 * 🚀 DEMONSTRAÇÃO COMPLETA
 * 
 * Inicializa todos os sistemas e demonstra o uso prático
 */

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Iniciando demonstração dos Fundamentos Modernos...');
    
    // === DEMONSTRAR HTML SEMÂNTICO === //
    const htmlBuilder = new SemanticHTMLBuilder();
    const semanticHTML = htmlBuilder.createSemanticStructure();
    const accessibilityFeatures = htmlBuilder.addAccessibilityFeatures();
    
    console.log('✅ HTML5 Semântico:', {
        structure: 'Criada',
        accessibility: accessibilityFeatures,
        validation: htmlBuilder.validateSemanticStructure(semanticHTML)
    });
    
    // === DEMONSTRAR CSS MODERNO === //
    const cssSystem = new ModernCSSSystem();
    const designSystem = cssSystem.createDesignSystem();
    const gridSystem = cssSystem.createGridSystem();
    const flexboxSystem = cssSystem.createFlexboxSystem();
    
    console.log('✅ CSS3 Avançado:', {
        designTokens: 'Configurados',
        gridSystem: 'Implementado',
        flexboxSystem: 'Implementado',
        components: 'Criados'
    });
    
    // === DEMONSTRAR JAVASCRIPT MODERNO === //
    const modernJS = new ModernJavaScript();
    const es6Features = modernJS.demonstrateES6Features();
    const modernAPIs = modernJS.demonstrateModernAPIs();
    
    console.log('✅ JavaScript ES6+:', {
        features: Object.keys(es6Features),
        apis: Object.keys(modernAPIs),
        status: 'Demonstrado'
    });
    
    // === DEMONSTRAR DESIGN RESPONSIVO === //
    const responsiveSystem = new ResponsiveDesignSystem();
    const adaptiveComponents = responsiveSystem.createAdaptiveComponents();
    
    console.log('✅ Design Responsivo:', {
        breakpoint: responsiveSystem.currentBreakpoint,
        components: Object.keys(adaptiveComponents),
        mobileFirst: 'Implementado'
    });
    
    // === INICIALIZAR LANDING PAGE === //
    const landingPage = new ModernLandingPage();
    
    console.log('✅ Landing Page Moderna:', {
        status: 'Inicializada',
        components: 'Carregados',
        performance: 'Monitorada'
    });
    
    // === APLICAR ESTILOS === //
    const styleElement = document.createElement('style');
    styleElement.textContent = LANDING_PAGE_CSS;
    document.head.appendChild(styleElement);
    
    console.log('🎉 Demonstração completa dos Fundamentos Modernos finalizada!');
    console.log('📚 Próximo módulo: Framework Principal (React)');
});

// =============================================================================
// 8. EXERCÍCIOS PRÁTICOS
// =============================================================================

/**
 * 📝 EXERCÍCIOS PARA PRATICAR
 * 
 * Desafios para consolidar o aprendizado
 */

const EXERCICIOS_PRATICOS = {
    exercicio1: {
        titulo: "Página de Portfólio Pessoal",
        descricao: "Crie uma página de portfólio usando HTML5 semântico, CSS Grid/Flexbox e JavaScript ES6+",
        requisitos: [
            "Estrutura HTML5 semântica completa",
            "Design responsivo Mobile First",
            "Animações CSS e JavaScript",
            "Formulário de contato funcional",
            "Galeria de projetos interativa",
            "Performance otimizada (90+ no Lighthouse)"
        ],
        dificuldade: "Intermediário",
        tempoEstimado: "4-6 horas"
    },
    
    exercicio2: {
        titulo: "Dashboard Administrativo",
        descricao: "Desenvolva um dashboard com gráficos, tabelas e componentes interativos",
        requisitos: [
            "Layout complexo com CSS Grid",
            "Componentes reutilizáveis",
            "Manipulação de dados com JavaScript",
            "Gráficos dinâmicos",
            "Filtros e busca em tempo real",
            "Tema claro/escuro"
        ],
        dificuldade: "Avançado",
        tempoEstimado: "6-8 horas"
    },
    
    exercicio3: {
        titulo: "PWA de Lista de Tarefas",
        descricao: "Construa uma Progressive Web App para gerenciamento de tarefas",
        requisitos: [
            "Service Worker para cache",
            "Funcionalidade offline",
            "Notificações push",
            "Instalação como app",
            "Sincronização de dados",
            "Acessibilidade completa"
        ],
        dificuldade: "Avançado",
        tempoEstimado: "8-10 horas"
    }
};

console.log('📝 Exercícios Práticos Disponíveis:', EXERCICIOS_PRATICOS);

/*
=============================================================================
                                RESUMO DO MÓDULO
=============================================================================

🎯 OBJETIVOS ALCANÇADOS:
✅ HTML5 semântico e acessibilidade
✅ CSS3 avançado (Grid, Flexbox, Custom Properties)
✅ JavaScript ES6+ e APIs modernas
✅ Design responsivo Mobile First
✅ Performance e otimização

🛠️ TECNOLOGIAS DOMINADAS:
• Elementos semânticos HTML5
• ARIA e acessibilidade web
• CSS Grid e Flexbox
• Custom Properties (CSS Variables)
• ES6+ (destructuring, async/await, classes)
• APIs modernas (Intersection Observer, Web Workers)
• Service Workers e PWA
• Design responsivo e Mobile First

🚀 PRÓXIMOS PASSOS:
1. Praticar com os exercícios propostos
2. Explorar frameworks CSS (Tailwind, Bootstrap)
3. Aprofundar em Web Components
4. Estudar ferramentas de build (Webpack, Vite)
5. Avançar para o Módulo 2: React Framework

💡 DICAS IMPORTANTES:
• Sempre priorize acessibilidade e semântica
• Use Mobile First em todos os projetos
• Monitore performance constantemente
• Mantenha-se atualizado com as especificações web
• Pratique regularmente para consolidar o conhecimento

=============================================================================
*/