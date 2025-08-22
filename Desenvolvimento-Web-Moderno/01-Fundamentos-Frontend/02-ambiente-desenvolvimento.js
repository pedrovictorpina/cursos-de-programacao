// =============================================================================
// MÓDULO 1: FUNDAMENTOS FRONTEND - AMBIENTE DE DESENVOLVIMENTO
// =============================================================================

/**
 * 🛠️ CONFIGURAÇÃO DE AMBIENTE DE DESENVOLVIMENTO MODERNO
 * 
 * Este arquivo aborda:
 * • Configuração de ferramentas essenciais
 * • Comparativo entre frameworks (React, Vue, Angular)
 * • Setup de ambiente produtivo
 * • Automação e workflows
 * • Debugging e profiling
 */

// =============================================================================
// 1. CONFIGURAÇÃO DE FERRAMENTAS ESSENCIAIS
// =============================================================================

/**
 * 🔧 GERENCIADOR DE AMBIENTE DE DESENVOLVIMENTO
 * 
 * Classe para configurar e gerenciar o ambiente de desenvolvimento
 */
class DevelopmentEnvironmentManager {
    constructor() {
        this.tools = new Map();
        this.configs = new Map();
        this.extensions = new Map();
        this.shortcuts = new Map();
        
        this.initializeEnvironment();
    }

    /**
     * Inicializa o ambiente de desenvolvimento
     */
    initializeEnvironment() {
        console.log('🚀 Configurando ambiente de desenvolvimento...');
        
        this.setupNodeEnvironment();
        this.setupPackageManagers();
        this.setupCodeEditor();
        this.setupBrowserTools();
        this.setupVersionControl();
        this.setupBuildTools();
        
        console.log('✅ Ambiente configurado com sucesso!');
    }

    /**
     * Configura ambiente Node.js
     */
    setupNodeEnvironment() {
        const nodeConfig = {
            version: 'LTS (18.x ou superior)',
            nvm: {
                description: 'Node Version Manager',
                commands: {
                    install: 'nvm install node',
                    use: 'nvm use node',
                    list: 'nvm list',
                    alias: 'nvm alias default node'
                },
                benefits: [
                    'Múltiplas versões do Node.js',
                    'Troca fácil entre projetos',
                    'Isolamento de dependências'
                ]
            },
            globalPackages: [
                '@vue/cli',
                'create-react-app',
                '@angular/cli',
                'vite',
                'webpack-cli',
                'typescript',
                'eslint',
                'prettier',
                'nodemon',
                'http-server'
            ]
        };
        
        this.configs.set('node', nodeConfig);
        
        // Verificar versão do Node.js
        this.checkNodeVersion();
    }

    /**
     * Verifica versão do Node.js
     */
    checkNodeVersion() {
        if (typeof process !== 'undefined' && process.version) {
            const version = process.version;
            const majorVersion = parseInt(version.slice(1).split('.')[0]);
            
            if (majorVersion >= 18) {
                console.log(`✅ Node.js ${version} - Versão adequada`);
            } else {
                console.warn(`⚠️ Node.js ${version} - Recomendado atualizar para v18+`);
            }
        } else {
            console.log('ℹ️ Executando no browser - Node.js não disponível');
        }
    }

    /**
     * Configura gerenciadores de pacotes
     */
    setupPackageManagers() {
        const packageManagers = {
            npm: {
                description: 'Node Package Manager (padrão)',
                commands: {
                    init: 'npm init -y',
                    install: 'npm install',
                    dev: 'npm install --save-dev',
                    global: 'npm install -g',
                    run: 'npm run',
                    audit: 'npm audit fix'
                },
                pros: ['Padrão do Node.js', 'Amplamente suportado'],
                cons: ['Mais lento', 'node_modules grandes']
            },
            yarn: {
                description: 'Yarn Package Manager (Facebook)',
                commands: {
                    init: 'yarn init -y',
                    install: 'yarn',
                    dev: 'yarn add --dev',
                    global: 'yarn global add',
                    run: 'yarn',
                    audit: 'yarn audit'
                },
                pros: ['Mais rápido', 'Lock file determinístico', 'Workspaces'],
                cons: ['Dependência adicional']
            },
            pnpm: {
                description: 'Performant NPM (mais eficiente)',
                commands: {
                    init: 'pnpm init',
                    install: 'pnpm install',
                    dev: 'pnpm add -D',
                    global: 'pnpm add -g',
                    run: 'pnpm',
                    audit: 'pnpm audit'
                },
                pros: ['Muito rápido', 'Economia de espaço', 'Strict mode'],
                cons: ['Menos adoção', 'Curva de aprendizado']
            }
        };
        
        this.configs.set('packageManagers', packageManagers);
    }

    /**
     * Configura editor de código
     */
    setupCodeEditor() {
        const editorConfig = {
            vscode: {
                description: 'Visual Studio Code (recomendado)',
                essentialExtensions: [
                    {
                        name: 'ES7+ React/Redux/React-Native snippets',
                        id: 'dsznajder.es7-react-js-snippets',
                        purpose: 'Snippets para React'
                    },
                    {
                        name: 'Prettier - Code formatter',
                        id: 'esbenp.prettier-vscode',
                        purpose: 'Formatação automática'
                    },
                    {
                        name: 'ESLint',
                        id: 'dbaeumer.vscode-eslint',
                        purpose: 'Linting JavaScript/TypeScript'
                    },
                    {
                        name: 'Auto Rename Tag',
                        id: 'formulahendry.auto-rename-tag',
                        purpose: 'Renomear tags HTML automaticamente'
                    },
                    {
                        name: 'Bracket Pair Colorizer',
                        id: 'coenraads.bracket-pair-colorizer',
                        purpose: 'Colorir parênteses e chaves'
                    },
                    {
                        name: 'Live Server',
                        id: 'ritwickdey.liveserver',
                        purpose: 'Servidor local com hot reload'
                    },
                    {
                        name: 'GitLens',
                        id: 'eamodio.gitlens',
                        purpose: 'Melhorar integração Git'
                    },
                    {
                        name: 'Thunder Client',
                        id: 'rangav.vscode-thunder-client',
                        purpose: 'Cliente REST integrado'
                    }
                ],
                settings: {
                    'editor.formatOnSave': true,
                    'editor.codeActionsOnSave': {
                        'source.fixAll.eslint': true
                    },
                    'editor.defaultFormatter': 'esbenp.prettier-vscode',
                    'editor.tabSize': 2,
                    'editor.insertSpaces': true,
                    'files.autoSave': 'onFocusChange',
                    'emmet.includeLanguages': {
                        'javascript': 'javascriptreact'
                    }
                },
                shortcuts: {
                    'Ctrl+Shift+P': 'Command Palette',
                    'Ctrl+`': 'Toggle Terminal',
                    'Ctrl+Shift+E': 'Explorer',
                    'Ctrl+Shift+F': 'Search',
                    'Ctrl+Shift+G': 'Source Control',
                    'F5': 'Debug',
                    'Ctrl+F5': 'Run without debugging'
                }
            }
        };
        
        this.configs.set('editor', editorConfig);
        this.setupEditorConfig();
    }

    /**
     * Cria arquivos de configuração do editor
     */
    setupEditorConfig() {
        const editorConfigContent = `# EditorConfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false`;
        
        const prettierConfig = {
            semi: true,
            trailingComma: 'es5',
            singleQuote: true,
            printWidth: 80,
            tabWidth: 2,
            useTabs: false
        };
        
        const eslintConfig = {
            env: {
                browser: true,
                es2021: true,
                node: true
            },
            extends: [
                'eslint:recommended',
                '@typescript-eslint/recommended',
                'prettier'
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            plugins: ['@typescript-eslint'],
            rules: {
                'no-console': 'warn',
                'no-unused-vars': 'error',
                'prefer-const': 'error'
            }
        };
        
        this.configs.set('editorconfig', editorConfigContent);
        this.configs.set('prettier', prettierConfig);
        this.configs.set('eslint', eslintConfig);
    }

    /**
     * Configura ferramentas do browser
     */
    setupBrowserTools() {
        const browserTools = {
            chrome: {
                devTools: {
                    elements: 'Inspecionar e modificar DOM/CSS',
                    console: 'Debug JavaScript e logs',
                    sources: 'Debug com breakpoints',
                    network: 'Monitorar requisições',
                    performance: 'Análise de performance',
                    application: 'Storage, Service Workers, PWA',
                    lighthouse: 'Auditoria de qualidade'
                },
                extensions: [
                    {
                        name: 'React Developer Tools',
                        purpose: 'Debug componentes React'
                    },
                    {
                        name: 'Vue.js devtools',
                        purpose: 'Debug aplicações Vue'
                    },
                    {
                        name: 'Redux DevTools',
                        purpose: 'Debug estado Redux'
                    },
                    {
                        name: 'Web Developer',
                        purpose: 'Ferramentas web gerais'
                    },
                    {
                        name: 'ColorZilla',
                        purpose: 'Picker de cores'
                    }
                ]
            },
            firefox: {
                devTools: {
                    inspector: 'DOM e CSS',
                    console: 'JavaScript console',
                    debugger: 'Debug JavaScript',
                    network: 'Monitor de rede',
                    performance: 'Profiling'
                }
            }
        };
        
        this.configs.set('browserTools', browserTools);
    }

    /**
     * Configura controle de versão
     */
    setupVersionControl() {
        const gitConfig = {
            installation: {
                windows: 'https://git-scm.com/download/win',
                mac: 'brew install git',
                linux: 'sudo apt-get install git'
            },
            globalConfig: {
                'user.name': 'git config --global user.name "Seu Nome"',
                'user.email': 'git config --global user.email "seu@email.com"',
                'init.defaultBranch': 'git config --global init.defaultBranch main',
                'core.autocrlf': 'git config --global core.autocrlf input'
            },
            essentialCommands: {
                init: 'git init',
                clone: 'git clone <url>',
                status: 'git status',
                add: 'git add .',
                commit: 'git commit -m "message"',
                push: 'git push origin main',
                pull: 'git pull origin main',
                branch: 'git branch <name>',
                checkout: 'git checkout <branch>',
                merge: 'git merge <branch>'
            },
            gitignoreTemplate: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log`
        };
        
        this.configs.set('git', gitConfig);
    }

    /**
     * Configura ferramentas de build
     */
    setupBuildTools() {
        const buildTools = {
            vite: {
                description: 'Build tool moderno e rápido',
                features: [
                    'Hot Module Replacement (HMR)',
                    'Build otimizado com Rollup',
                    'Suporte nativo a TypeScript',
                    'CSS preprocessors',
                    'Plugins extensíveis'
                ],
                config: {
                    'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`
                }
            },
            webpack: {
                description: 'Bundler tradicional e poderoso',
                features: [
                    'Module bundling',
                    'Code splitting',
                    'Loaders e plugins',
                    'Dev server',
                    'Hot reloading'
                ]
            },
            parcel: {
                description: 'Zero-config bundler',
                features: [
                    'Configuração automática',
                    'Hot reloading',
                    'Code splitting',
                    'Otimizações automáticas'
                ]
            }
        };
        
        this.configs.set('buildTools', buildTools);
    }

    /**
     * Gera relatório do ambiente
     */
    generateEnvironmentReport() {
        const report = {
            timestamp: new Date().toISOString(),
            node: this.configs.get('node'),
            packageManagers: this.configs.get('packageManagers'),
            editor: this.configs.get('editor'),
            git: this.configs.get('git'),
            buildTools: this.configs.get('buildTools')
        };
        
        console.log('📊 Relatório do Ambiente:', report);
        return report;
    }
}

// =============================================================================
// 2. COMPARATIVO ENTRE FRAMEWORKS
// =============================================================================

/**
 * 🏗️ COMPARADOR DE FRAMEWORKS FRONTEND
 * 
 * Análise detalhada dos principais frameworks
 */
class FrameworkComparator {
    constructor() {
        this.frameworks = new Map();
        this.criteria = [
            'curvaAprendizado',
            'performance',
            'ecosistema',
            'comunidade',
            'documentacao',
            'tooling',
            'testing',
            'mobile',
            'ssr',
            'typescript'
        ];
        
        this.initializeFrameworks();
    }

    /**
     * Inicializa dados dos frameworks
     */
    initializeFrameworks() {
        this.setupReact();
        this.setupVue();
        this.setupAngular();
        this.setupSvelte();
    }

    /**
     * Configura dados do React
     */
    setupReact() {
        const react = {
            name: 'React',
            creator: 'Facebook/Meta',
            firstRelease: '2013',
            currentVersion: '18.x',
            type: 'Library',
            
            description: 'Biblioteca JavaScript para construir interfaces de usuário',
            
            coreFeatures: [
                'Virtual DOM',
                'Component-based',
                'Unidirectional data flow',
                'JSX syntax',
                'Hooks',
                'Context API',
                'Concurrent features'
            ],
            
            ecosystem: {
                routing: 'React Router',
                stateManagement: ['Redux', 'Zustand', 'Recoil'],
                styling: ['Styled Components', 'Emotion', 'CSS Modules'],
                testing: ['Jest', 'React Testing Library'],
                devTools: 'React DevTools',
                ssr: ['Next.js', 'Gatsby'],
                mobile: 'React Native'
            },
            
            pros: [
                'Flexibilidade e liberdade de escolha',
                'Ecossistema maduro e extenso',
                'Grande comunidade e suporte',
                'Boa performance com Virtual DOM',
                'Hooks modernizam o desenvolvimento',
                'Excelente tooling e DevTools',
                'React Native para mobile'
            ],
            
            cons: [
                'Curva de aprendizado íngreme',
                'Muitas decisões para tomar',
                'Mudanças frequentes no ecossistema',
                'JSX pode confundir iniciantes',
                'Necessita bibliotecas adicionais'
            ],
            
            scores: {
                curvaAprendizado: 6,
                performance: 8,
                ecosistema: 10,
                comunidade: 10,
                documentacao: 8,
                tooling: 9,
                testing: 9,
                mobile: 9,
                ssr: 9,
                typescript: 8
            },
            
            idealFor: [
                'Aplicações complexas e escaláveis',
                'Equipes experientes',
                'Projetos que precisam de flexibilidade',
                'Aplicações com muita interatividade',
                'Projetos que podem evoluir para mobile'
            ],
            
            gettingStarted: {
                installation: 'npx create-react-app my-app',
                basicComponent: `import React from 'react';

function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default Welcome;`,
                withHooks: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;`
            }
        };
        
        this.frameworks.set('react', react);
    }

    /**
     * Configura dados do Vue
     */
    setupVue() {
        const vue = {
            name: 'Vue.js',
            creator: 'Evan You',
            firstRelease: '2014',
            currentVersion: '3.x',
            type: 'Progressive Framework',
            
            description: 'Framework progressivo para construir interfaces de usuário',
            
            coreFeatures: [
                'Template syntax',
                'Reactive data binding',
                'Component system',
                'Directives',
                'Computed properties',
                'Composition API',
                'Single File Components'
            ],
            
            ecosystem: {
                routing: 'Vue Router',
                stateManagement: ['Vuex', 'Pinia'],
                styling: ['Vue styled-components', 'CSS Modules'],
                testing: ['Vue Test Utils', 'Jest'],
                devTools: 'Vue DevTools',
                ssr: ['Nuxt.js'],
                mobile: ['NativeScript-Vue', 'Quasar']
            },
            
            pros: [
                'Curva de aprendizado suave',
                'Documentação excelente',
                'Template syntax familiar',
                'Boa performance',
                'Flexível e progressivo',
                'Single File Components',
                'Composition API poderosa'
            ],
            
            cons: [
                'Ecossistema menor que React',
                'Menos oportunidades de trabalho',
                'Comunidade menor',
                'Menos recursos de terceiros',
                'Dependência de um desenvolvedor principal'
            ],
            
            scores: {
                curvaAprendizado: 9,
                performance: 8,
                ecosistema: 7,
                comunidade: 7,
                documentacao: 10,
                tooling: 8,
                testing: 7,
                mobile: 6,
                ssr: 8,
                typescript: 7
            },
            
            idealFor: [
                'Iniciantes em frameworks',
                'Projetos de pequeno a médio porte',
                'Equipes que valorizam simplicidade',
                'Migração gradual de jQuery',
                'Prototipagem rápida'
            ],
            
            gettingStarted: {
                installation: 'npm create vue@latest my-project',
                basicComponent: `<template>
  <h1>{{ message }}</h1>
  <button @click="count++">Count: {{ count }}</button>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!',
      count: 0
    }
  }
}
</script>`,
                withComposition: `<template>
  <h1>{{ message }}</h1>
  <button @click="increment">Count: {{ count }}</button>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue 3!')
const count = ref(0)

function increment() {
  count.value++
}
</script>`
            }
        };
        
        this.frameworks.set('vue', vue);
    }

    /**
     * Configura dados do Angular
     */
    setupAngular() {
        const angular = {
            name: 'Angular',
            creator: 'Google',
            firstRelease: '2016',
            currentVersion: '17.x',
            type: 'Full Framework',
            
            description: 'Plataforma completa para desenvolvimento de aplicações web',
            
            coreFeatures: [
                'TypeScript first',
                'Dependency Injection',
                'Component architecture',
                'Templates declarativos',
                'Two-way data binding',
                'Services e Observables',
                'CLI poderosa'
            ],
            
            ecosystem: {
                routing: 'Angular Router (built-in)',
                stateManagement: ['NgRx', 'Akita'],
                styling: ['Angular Material', 'PrimeNG'],
                testing: ['Jasmine', 'Karma', 'Protractor'],
                devTools: 'Angular DevTools',
                ssr: 'Angular Universal',
                mobile: ['Ionic', 'NativeScript']
            },
            
            pros: [
                'Framework completo e opinativo',
                'TypeScript nativo',
                'Arquitetura robusta',
                'CLI excelente',
                'Dependency Injection',
                'Boa para aplicações enterprise',
                'Suporte do Google'
            ],
            
            cons: [
                'Curva de aprendizado íngreme',
                'Verboso e complexo',
                'Bundle size grande',
                'Mudanças breaking frequentes',
                'Over-engineering para projetos simples'
            ],
            
            scores: {
                curvaAprendizado: 4,
                performance: 7,
                ecosistema: 8,
                comunidade: 8,
                documentacao: 9,
                tooling: 10,
                testing: 9,
                mobile: 8,
                ssr: 8,
                typescript: 10
            },
            
            idealFor: [
                'Aplicações enterprise',
                'Equipes grandes',
                'Projetos de longo prazo',
                'Aplicações complexas',
                'Desenvolvedores com background OOP'
            ],
            
            gettingStarted: {
                installation: 'npm install -g @angular/cli && ng new my-app',
                basicComponent: `import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: \`
    <h1>{{title}}</h1>
    <button (click)="increment()">Count: {{count}}</button>
  \`
})
export class HelloComponent {
  title = 'Hello Angular!';
  count = 0;
  
  increment() {
    this.count++;
  }
}`,
                withService: `import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private countSubject = new BehaviorSubject(0);
  count$ = this.countSubject.asObservable();
  
  increment() {
    this.countSubject.next(this.countSubject.value + 1);
  }
}`
            }
        };
        
        this.frameworks.set('angular', angular);
    }

    /**
     * Configura dados do Svelte
     */
    setupSvelte() {
        const svelte = {
            name: 'Svelte',
            creator: 'Rich Harris',
            firstRelease: '2016',
            currentVersion: '4.x',
            type: 'Compile-time Framework',
            
            description: 'Framework que compila para JavaScript vanilla otimizado',
            
            coreFeatures: [
                'No Virtual DOM',
                'Compile-time optimizations',
                'Reactive assignments',
                'Built-in state management',
                'CSS scoping',
                'Transitions e animations',
                'Stores'
            ],
            
            ecosystem: {
                routing: 'SvelteKit Router',
                stateManagement: 'Svelte Stores (built-in)',
                styling: 'Scoped CSS (built-in)',
                testing: ['Jest', '@testing-library/svelte'],
                devTools: 'Svelte DevTools',
                ssr: 'SvelteKit',
                mobile: ['Capacitor', 'Cordova']
            },
            
            pros: [
                'Bundle size muito pequeno',
                'Performance excelente',
                'Sintaxe simples e intuitiva',
                'Menos boilerplate',
                'Compilação otimizada',
                'CSS scoping nativo'
            ],
            
            cons: [
                'Ecossistema pequeno',
                'Comunidade menor',
                'Menos recursos e bibliotecas',
                'Mercado de trabalho limitado',
                'Ainda em evolução'
            ],
            
            scores: {
                curvaAprendizado: 8,
                performance: 10,
                ecosistema: 5,
                comunidade: 5,
                documentacao: 8,
                tooling: 6,
                testing: 6,
                mobile: 5,
                ssr: 7,
                typescript: 7
            },
            
            idealFor: [
                'Aplicações que precisam de performance',
                'Projetos com restrições de bundle size',
                'Desenvolvedores que preferem simplicidade',
                'Prototipagem rápida',
                'Aplicações com animações complexas'
            ],
            
            gettingStarted: {
                installation: 'npm create svelte@latest my-app',
                basicComponent: `<script>
  let name = 'Svelte';
  let count = 0;
  
  function increment() {
    count += 1;
  }
</script>

<h1>Hello {name}!</h1>
<button on:click={increment}>
  Count: {count}
</button>

<style>
  h1 {
    color: #ff3e00;
  }
</style>`,
                withStore: `// store.js
import { writable } from 'svelte/store';

export const count = writable(0);

// Component.svelte
<script>
  import { count } from './store.js';
  
  function increment() {
    count.update(n => n + 1);
  }
</script>

<button on:click={increment}>
  Count: {$count}
</button>`
            }
        };
        
        this.frameworks.set('svelte', svelte);
    }

    /**
     * Compara frameworks baseado em critérios
     */
    compareFrameworks(frameworks = ['react', 'vue', 'angular']) {
        const comparison = {
            frameworks: frameworks.map(name => {
                const framework = this.frameworks.get(name);
                return {
                    name: framework.name,
                    scores: framework.scores,
                    totalScore: Object.values(framework.scores).reduce((a, b) => a + b, 0)
                };
            }),
            criteria: this.criteria,
            analysis: this.generateAnalysis(frameworks)
        };
        
        console.log('📊 Comparação de Frameworks:', comparison);
        return comparison;
    }

    /**
     * Gera análise detalhada
     */
    generateAnalysis(frameworks) {
        const analysis = {};
        
        this.criteria.forEach(criterion => {
            const scores = frameworks.map(name => ({
                name: this.frameworks.get(name).name,
                score: this.frameworks.get(name).scores[criterion]
            }));
            
            scores.sort((a, b) => b.score - a.score);
            analysis[criterion] = {
                winner: scores[0],
                ranking: scores
            };
        });
        
        return analysis;
    }

    /**
     * Recomenda framework baseado em necessidades
     */
    recommendFramework(needs) {
        const recommendations = {
            beginner: {
                framework: 'vue',
                reason: 'Curva de aprendizado suave e documentação excelente'
            },
            enterprise: {
                framework: 'angular',
                reason: 'Arquitetura robusta e ferramentas enterprise'
            },
            flexibility: {
                framework: 'react',
                reason: 'Máxima flexibilidade e ecossistema extenso'
            },
            performance: {
                framework: 'svelte',
                reason: 'Performance superior e bundle size mínimo'
            },
            mobile: {
                framework: 'react',
                reason: 'React Native para desenvolvimento mobile'
            },
            rapid: {
                framework: 'vue',
                reason: 'Desenvolvimento rápido e prototipagem eficiente'
            }
        };
        
        const recommendation = recommendations[needs] || recommendations.beginner;
        
        console.log(`💡 Recomendação para "${needs}":`, recommendation);
        return recommendation;
    }

    /**
     * Gera relatório completo
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            frameworks: Array.from(this.frameworks.values()),
            comparison: this.compareFrameworks(),
            recommendations: {
                beginner: this.recommendFramework('beginner'),
                enterprise: this.recommendFramework('enterprise'),
                performance: this.recommendFramework('performance')
            }
        };
        
        console.log('📋 Relatório Completo de Frameworks:', report);
        return report;
    }
}

// =============================================================================
// 3. AUTOMAÇÃO E WORKFLOWS
// =============================================================================

/**
 * 🤖 GERENCIADOR DE AUTOMAÇÃO
 * 
 * Configura workflows e automações para desenvolvimento
 */
class AutomationManager {
    constructor() {
        this.workflows = new Map();
        this.scripts = new Map();
        this.hooks = new Map();
        
        this.setupWorkflows();
    }

    /**
     * Configura workflows de desenvolvimento
     */
    setupWorkflows() {
        this.setupPackageScripts();
        this.setupGitHooks();
        this.setupCICD();
        this.setupLinting();
    }

    /**
     * Configura scripts do package.json
     */
    setupPackageScripts() {
        const packageScripts = {
            // Desenvolvimento
            'dev': 'vite',
            'dev:host': 'vite --host',
            'dev:debug': 'vite --debug',
            
            // Build
            'build': 'vite build',
            'build:analyze': 'vite build --mode analyze',
            'build:staging': 'vite build --mode staging',
            
            // Preview
            'preview': 'vite preview',
            'preview:host': 'vite preview --host',
            
            // Testes
            'test': 'jest',
            'test:watch': 'jest --watch',
            'test:coverage': 'jest --coverage',
            'test:e2e': 'cypress run',
            'test:e2e:open': 'cypress open',
            
            // Linting e formatação
            'lint': 'eslint src --ext .js,.jsx,.ts,.tsx',
            'lint:fix': 'eslint src --ext .js,.jsx,.ts,.tsx --fix',
            'format': 'prettier --write src/**/*.{js,jsx,ts,tsx,css,md}',
            'format:check': 'prettier --check src/**/*.{js,jsx,ts,tsx,css,md}',
            
            // Qualidade
            'typecheck': 'tsc --noEmit',
            'audit': 'npm audit',
            'audit:fix': 'npm audit fix',
            
            // Utilitários
            'clean': 'rimraf dist node_modules/.cache',
            'deps:update': 'npm update',
            'deps:check': 'npm outdated',
            
            // Hooks
            'prepare': 'husky install',
            'pre-commit': 'lint-staged',
            'pre-push': 'npm run test && npm run build'
        };
        
        this.scripts.set('package', packageScripts);
    }

    /**
     * Configura Git Hooks
     */
    setupGitHooks() {
        const gitHooks = {
            'pre-commit': {
                description: 'Executa antes do commit',
                tools: ['husky', 'lint-staged'],
                config: {
                    'lint-staged': {
                        '*.{js,jsx,ts,tsx}': [
                            'eslint --fix',
                            'prettier --write',
                            'git add'
                        ],
                        '*.{css,md,json}': [
                            'prettier --write',
                            'git add'
                        ]
                    }
                },
                script: `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged`
            },
            'commit-msg': {
                description: 'Valida mensagem do commit',
                tools: ['commitlint'],
                config: {
                    'commitlint.config.js': `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
    ]
  }
}`
                },
                script: `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1`
            },
            'pre-push': {
                description: 'Executa antes do push',
                script: `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test
npm run build`
            }
        };
        
        this.hooks.set('git', gitHooks);
    }

    /**
     * Configura CI/CD
     */
    setupCICD() {
        const cicdConfigs = {
            github: {
                workflow: {
                    name: 'CI/CD Pipeline',
                    file: '.github/workflows/ci.yml',
                    content: `name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Build project
      run: npm run build
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install and build
      run: |
        npm ci
        npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}`
                }
            },
            gitlab: {
                pipeline: {
                    file: '.gitlab-ci.yml',
                    content: `stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run lint
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: node:$NODE_VERSION
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=dist
  only:
    - main`
                }
            }
        };
        
        this.workflows.set('cicd', cicdConfigs);
    }

    /**
     * Configura linting avançado
     */
    setupLinting() {
        const lintingConfig = {
            eslint: {
                extends: [
                    'eslint:recommended',
                    '@typescript-eslint/recommended',
                    'plugin:react/recommended',
                    'plugin:react-hooks/recommended',
                    'plugin:jsx-a11y/recommended',
                    'prettier'
                ],
                plugins: [
                    '@typescript-eslint',
                    'react',
                    'react-hooks',
                    'jsx-a11y',
                    'import'
                ],
                rules: {
                    // TypeScript
                    '@typescript-eslint/no-unused-vars': 'error',
                    '@typescript-eslint/explicit-function-return-type': 'warn',
                    
                    // React
                    'react/prop-types': 'off',
                    'react/react-in-jsx-scope': 'off',
                    
                    // Imports
                    'import/order': [
                        'error',
                        {
                            'groups': [
                                'builtin',
                                'external',
                                'internal',
                                'parent',
                                'sibling',
                                'index'
                            ],
                            'newlines-between': 'always'
                        }
                    ],
                    
                    // Geral
                    'no-console': 'warn',
                    'prefer-const': 'error',
                    'no-var': 'error'
                }
            },
            stylelint: {
                extends: [
                    'stylelint-config-standard',
                    'stylelint-config-prettier'
                ],
                rules: {
                    'color-hex-case': 'lower',
                    'color-hex-length': 'short',
                    'declaration-block-trailing-semicolon': 'always',
                    'indentation': 2
                }
            }
        };
        
        this.workflows.set('linting', lintingConfig);
    }

    /**
     * Gera configurações de projeto
     */
    generateProjectConfig() {
        const config = {
            'package.json': {
                scripts: this.scripts.get('package'),
                devDependencies: {
                    // Build tools
                    'vite': '^5.0.0',
                    '@vitejs/plugin-react': '^4.0.0',
                    
                    // TypeScript
                    'typescript': '^5.0.0',
                    '@types/react': '^18.0.0',
                    '@types/react-dom': '^18.0.0',
                    
                    // Linting
                    'eslint': '^8.0.0',
                    '@typescript-eslint/eslint-plugin': '^6.0.0',
                    '@typescript-eslint/parser': '^6.0.0',
                    'eslint-plugin-react': '^7.0.0',
                    'eslint-plugin-react-hooks': '^4.0.0',
                    'eslint-plugin-jsx-a11y': '^6.0.0',
                    
                    // Formatting
                    'prettier': '^3.0.0',
                    'eslint-config-prettier': '^9.0.0',
                    
                    // Testing
                    'jest': '^29.0.0',
                    '@testing-library/react': '^13.0.0',
                    '@testing-library/jest-dom': '^6.0.0',
                    
                    // Git hooks
                    'husky': '^8.0.0',
                    'lint-staged': '^14.0.0',
                    '@commitlint/cli': '^17.0.0',
                    '@commitlint/config-conventional': '^17.0.0'
                }
            },
            '.eslintrc.js': this.workflows.get('linting').eslint,
            '.prettierrc': {
                semi: true,
                trailingComma: 'es5',
                singleQuote: true,
                printWidth: 80,
                tabWidth: 2
            },
            'tsconfig.json': {
                compilerOptions: {
                    target: 'ES2020',
                    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                    allowJs: false,
                    skipLibCheck: true,
                    esModuleInterop: false,
                    allowSyntheticDefaultImports: true,
                    strict: true,
                    forceConsistentCasingInFileNames: true,
                    module: 'ESNext',
                    moduleResolution: 'bundler',
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                    jsx: 'react-jsx'
                },
                include: ['src'],
                references: [{ path: './tsconfig.node.json' }]
            }
        };
        
        console.log('⚙️ Configuração do Projeto:', config);
        return config;
    }
}

// =============================================================================
// 4. DEBUGGING E PROFILING
// =============================================================================

/**
 * 🐛 SISTEMA DE DEBUGGING
 * 
 * Ferramentas e técnicas para debugging eficiente
 */
class DebuggingSystem {
    constructor() {
        this.debuggers = new Map();
        this.profilers = new Map();
        this.monitors = new Map();
        
        this.setupDebuggingTools();
    }

    /**
     * Configura ferramentas de debugging
     */
    setupDebuggingTools() {
        this.setupBrowserDebugging();
        this.setupVSCodeDebugging();
        this.setupPerformanceProfiling();
        this.setupErrorMonitoring();
    }

    /**
     * Configura debugging no browser
     */
    setupBrowserDebugging() {
        const browserDebugging = {
            console: {
                methods: {
                    'console.log()': 'Log básico',
                    'console.warn()': 'Avisos',
                    'console.error()': 'Erros',
                    'console.info()': 'Informações',
                    'console.debug()': 'Debug detalhado',
                    'console.table()': 'Dados em tabela',
                    'console.group()': 'Agrupar logs',
                    'console.time()': 'Medir tempo',
                    'console.trace()': 'Stack trace'
                },
                advanced: {
                    'console.assert()': 'Assertions',
                    'console.count()': 'Contador',
                    'console.profile()': 'Profiling',
                    'console.memory': 'Uso de memória'
                }
            },
            devtools: {
                elements: {
                    inspect: 'Inspecionar elementos',
                    styles: 'Modificar CSS em tempo real',
                    computed: 'Estilos computados',
                    eventListeners: 'Event listeners'
                },
                sources: {
                    breakpoints: 'Pontos de parada',
                    stepOver: 'Executar linha por linha',
                    stepInto: 'Entrar em funções',
                    stepOut: 'Sair de funções',
                    watchExpressions: 'Observar variáveis'
                },
                network: {
                    requests: 'Monitorar requisições',
                    timing: 'Tempo de resposta',
                    headers: 'Cabeçalhos HTTP',
                    preview: 'Preview da resposta'
                },
                performance: {
                    recording: 'Gravar performance',
                    flamegraph: 'Flame graph',
                    memory: 'Uso de memória',
                    fps: 'Frames por segundo'
                }
            }
        };
        
        this.debuggers.set('browser', browserDebugging);
    }

    /**
     * Configura debugging no VS Code
     */
    setupVSCodeDebugging() {
        const vscodeDebugging = {
            configuration: {
                file: '.vscode/launch.json',
                content: {
                    version: '0.2.0',
                    configurations: [
                        {
                            name: 'Launch Chrome',
                            request: 'launch',
                            type: 'chrome',
                            url: 'http://localhost:3000',
                            webRoot: '${workspaceFolder}/src',
                            sourceMapPathOverrides: {
                                'webpack:///src/*': '${webRoot}/*'
                            }
                        },
                        {
                            name: 'Attach to Chrome',
                            port: 9222,
                            request: 'attach',
                            type: 'chrome',
                            webRoot: '${workspaceFolder}/src'
                        },
                        {
                            name: 'Debug Jest Tests',
                            type: 'node',
                            request: 'launch',
                            program: '${workspaceFolder}/node_modules/.bin/jest',
                            args: ['--runInBand'],
                            console: 'integratedTerminal',
                            internalConsoleOptions: 'neverOpen'
                        }
                    ]
                }
            },
            features: {
                breakpoints: 'Pontos de parada visuais',
                variables: 'Inspeção de variáveis',
                callStack: 'Pilha de chamadas',
                watch: 'Expressões observadas',
                debug_console: 'Console de debug'
            }
        };
        
        this.debuggers.set('vscode', vscodeDebugging);
    }

    /**
     * Configura profiling de performance
     */
    setupPerformanceProfiling() {
        const performanceProfiling = {
            webVitals: {
                lcp: 'Largest Contentful Paint',
                fid: 'First Input Delay',
                cls: 'Cumulative Layout Shift',
                fcp: 'First Contentful Paint',
                ttfb: 'Time to First Byte'
            },
            tools: {
                lighthouse: {
                    description: 'Auditoria completa',
                    metrics: ['Performance', 'Accessibility', 'Best Practices', 'SEO'],
                    usage: 'npx lighthouse http://localhost:3000'
                },
                webPageTest: {
                    description: 'Teste de performance detalhado',
                    url: 'https://www.webpagetest.org/'
                },
                bundleAnalyzer: {
                    description: 'Análise do bundle',
                    usage: 'npm run build:analyze'
                }
            },
            monitoring: {
                performanceObserver: `// Monitorar Web Vitals
if ('PerformanceObserver' in window) {
  // LCP
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // FID
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });
}`,
                resourceTiming: `// Monitorar recursos
window.addEventListener('load', () => {
  const resources = performance.getEntriesByType('resource');
  resources.forEach(resource => {
    console.log(resource.name, resource.duration);
  });
});`
            }
        };
        
        this.profilers.set('performance', performanceProfiling);
    }

    /**
     * Configura monitoramento de erros
     */
    setupErrorMonitoring() {
        const errorMonitoring = {
            clientSide: {
                globalHandler: `// Handler global de erros
window.addEventListener('error', (event) => {
  console.error('Global Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});`,
                promiseRejection: `// Promises rejeitadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});`,
                reactErrorBoundary: `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    
    return this.props.children;
  }
}`
            },
            tools: {
                sentry: {
                    description: 'Monitoramento de erros em produção',
                    setup: `import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_DSN_HERE',
  environment: process.env.NODE_ENV
});`
                },
                logRocket: {
                    description: 'Gravação de sessões',
                    setup: `import LogRocket from 'logrocket';

LogRocket.init('your-app-id');`
                }
            }
        };
        
        this.monitors.set('errors', errorMonitoring);
    }

    /**
     * Gera guia de debugging
     */
    generateDebuggingGuide() {
        const guide = {
            quickStart: {
                browser: [
                    'Abra DevTools (F12)',
                    'Vá para Sources tab',
                    'Adicione breakpoints',
                    'Recarregue a página',
                    'Use Step Over/Into/Out'
                ],
                vscode: [
                    'Configure launch.json',
                    'Adicione breakpoints',
                    'Pressione F5',
                    'Use Debug Console',
                    'Inspecione variáveis'
                ]
            },
            commonIssues: {
                'Variável undefined': {
                    solution: 'Verifique escopo e inicialização',
                    debug: 'console.log() antes do uso'
                },
                'Async/await errors': {
                    solution: 'Use try/catch blocks',
                    debug: 'Verifique Promise rejections'
                },
                'State não atualiza': {
                    solution: 'Verifique imutabilidade',
                    debug: 'Use React DevTools'
                },
                'Performance lenta': {
                    solution: 'Profile com DevTools',
                    debug: 'Lighthouse audit'
                }
            },
            bestPractices: [
                'Use console.log estrategicamente',
                'Remova logs antes do deploy',
                'Configure source maps',
                'Use React DevTools',
                'Monitor performance em produção',
                'Implemente error boundaries',
                'Configure error tracking'
            ]
        };
        
        console.log('🐛 Guia de Debugging:', guide);
        return guide;
    }
}

// =============================================================================
// 5. EXERCÍCIOS PRÁTICOS
// =============================================================================

/**
 * 🎯 EXERCÍCIOS DE CONFIGURAÇÃO DE AMBIENTE
 * 
 * Exercícios práticos para consolidar o aprendizado
 */
class EnvironmentExercises {
    constructor() {
        this.exercises = new Map();
        this.solutions = new Map();
        
        this.setupExercises();
    }

    /**
     * Configura exercícios práticos
     */
    setupExercises() {
        const exercises = {
            exercise1: {
                title: 'Configuração Básica de Projeto',
                description: 'Configure um projeto React do zero com todas as ferramentas essenciais',
                tasks: [
                    'Instale Node.js e npm/yarn',
                    'Crie projeto com Vite',
                    'Configure ESLint e Prettier',
                    'Configure Git e .gitignore',
                    'Adicione scripts úteis ao package.json'
                ],
                difficulty: 'Iniciante',
                timeEstimate: '30 minutos'
            },
            
            exercise2: {
                title: 'Setup de Debugging Avançado',
                description: 'Configure debugging completo para VS Code e browser',
                tasks: [
                    'Configure launch.json para VS Code',
                    'Instale extensões essenciais',
                    'Configure React DevTools',
                    'Teste debugging com breakpoints',
                    'Configure error boundaries'
                ],
                difficulty: 'Intermediário',
                timeEstimate: '45 minutos'
            },
            
            exercise3: {
                title: 'Automação e CI/CD',
                description: 'Implemente automação completa com Git hooks e CI/CD',
                tasks: [
                    'Configure Husky e lint-staged',
                    'Implemente commit message validation',
                    'Configure GitHub Actions',
                    'Adicione testes automatizados',
                    'Configure deploy automático'
                ],
                difficulty: 'Avançado',
                timeEstimate: '60 minutos'
            },
            
            exercise4: {
                title: 'Comparação de Frameworks',
                description: 'Crie o mesmo componente em React, Vue e Angular',
                tasks: [
                    'Crie um contador em React',
                    'Implemente o mesmo em Vue',
                    'Desenvolva versão Angular',
                    'Compare performance',
                    'Documente diferenças'
                ],
                difficulty: 'Avançado',
                timeEstimate: '90 minutos'
            }
        };
        
        this.exercises.set('practical', exercises);
    }

    /**
     * Executa demonstração completa
     */
    runDemo() {
        console.log('🚀 Demonstração: Configuração de Ambiente de Desenvolvimento');
        
        // Instanciar gerenciadores
        const envManager = new DevelopmentEnvironmentManager();
        const frameworkComparator = new FrameworkComparator();
        const automationManager = new AutomationManager();
        const debuggingSystem = new DebuggingSystem();
        
        // Gerar relatórios
        console.log('\n📊 Relatórios:');
        envManager.generateEnvironmentReport();
        frameworkComparator.generateReport();
        automationManager.generateProjectConfig();
        debuggingSystem.generateDebuggingGuide();
        
        // Recomendações
        console.log('\n💡 Recomendações:');
        console.log('- Para iniciantes: Vue.js + Vite + VS Code');
        console.log('- Para projetos enterprise: Angular + TypeScript + Jest');
        console.log('- Para máxima flexibilidade: React + Next.js + Vercel');
        console.log('- Para performance: Svelte + SvelteKit + Netlify');
        
        return {
            environment: envManager,
            frameworks: frameworkComparator,
            automation: automationManager,
            debugging: debuggingSystem
        };
    }
}

// =============================================================================
// 6. RESUMO E PRÓXIMOS PASSOS
// =============================================================================

/**
 * 📚 RESUMO DO MÓDULO
 * 
 * Este módulo cobriu:
 * 
 * 🛠️ CONFIGURAÇÃO DE AMBIENTE:
 * • Node.js e gerenciadores de pacotes (npm, yarn, pnpm)
 * • VS Code com extensões essenciais
 * • Git e controle de versão
 * • Ferramentas de build (Vite, Webpack, Parcel)
 * 
 * 🏗️ COMPARAÇÃO DE FRAMEWORKS:
 * • React: Flexibilidade e ecossistema extenso
 * • Vue: Curva de aprendizado suave e documentação excelente
 * • Angular: Framework completo para aplicações enterprise
 * • Svelte: Performance superior e bundle size mínimo
 * 
 * 🤖 AUTOMAÇÃO E WORKFLOWS:
 * • Scripts do package.json
 * • Git hooks com Husky e lint-staged
 * • CI/CD com GitHub Actions
 * • Linting e formatação automática
 * 
 * 🐛 DEBUGGING E PROFILING:
 * • DevTools do browser
 * • Debugging no VS Code
 * • Monitoramento de performance
 * • Error tracking e monitoring
 * 
 * 🎯 PRÓXIMOS PASSOS:
 * • Escolher um framework principal
 * • Configurar projeto completo
 * • Praticar debugging
 * • Implementar automação
 * • Estudar padrões de arquitetura
 */

// Executar demonstração
if (typeof window !== 'undefined') {
    // Browser environment
    window.EnvironmentDemo = new EnvironmentExercises();
    console.log('🌐 Demo disponível em: window.EnvironmentDemo.runDemo()');
} else {
    // Node.js environment
    const demo = new EnvironmentExercises();
    console.log('🖥️ Executando demo no Node.js...');
    demo.runDemo();
}

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DevelopmentEnvironmentManager,
        FrameworkComparator,
        AutomationManager,
        DebuggingSystem,
        EnvironmentExercises
    };
}