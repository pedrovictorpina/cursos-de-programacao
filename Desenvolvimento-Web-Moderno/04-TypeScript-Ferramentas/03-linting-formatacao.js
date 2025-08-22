/*
=============================================================================
                    MÓDULO 4: TYPESCRIPT E FERRAMENTAS
                      03 - LINTING E FORMATAÇÃO
=============================================================================

Este arquivo aborda ferramentas de linting e formatação de código, incluindo
ESLint, Prettier, Husky, lint-staged e configurações para diferentes cenários.

📚 TÓPICOS ABORDADOS:
- ESLint: configuração e regras
- Prettier: formatação automática
- Husky: Git hooks
- lint-staged: linting incremental
- Configurações para TypeScript
- Integração com editores
- Workflows de qualidade

*/

// =============================================================================
// 1. CONCEITOS DE QUALIDADE DE CÓDIGO
// =============================================================================

/*
Linting e formatação são fundamentais para manter código consistente,
legível e livre de erros comuns.

CONCEITOS PRINCIPAIS:
- Linting: Análise estática para detectar problemas
- Formatação: Padronização visual do código
- Code style: Convenções de escrita
- Git hooks: Automação em eventos do Git
- Continuous Integration: Verificação automatizada
- Editor integration: Feedback em tempo real
*/

class CodeQualityConcepts {
  // Demonstração de problemas que linting detecta
  static demonstrateLintingIssues() {
    // Exemplos de código com problemas que ESLint detectaria
    
    const problemExamples = {
      // 1. Variáveis não utilizadas
      unusedVariables: {
        bad: `
          function calculateTotal(items) {
            const tax = 0.1; // unused variable
            const discount = 0.05; // unused variable
            return items.reduce((sum, item) => sum + item.price, 0);
          }
        `,
        good: `
          function calculateTotal(items) {
            return items.reduce((sum, item) => sum + item.price, 0);
          }
        `
      },
      
      // 2. Comparações perigosas
      dangerousComparisons: {
        bad: `
          function isValid(value) {
            if (value == true) { // loose equality
              return 'valid';
            }
            return 'invalid';
          }
        `,
        good: `
          function isValid(value) {
            if (value === true) { // strict equality
              return 'valid';
            }
            return 'invalid';
          }
        `
      },
      
      // 3. Funções muito complexas
      complexFunctions: {
        bad: `
          function processUser(user) {
            if (user) {
              if (user.active) {
                if (user.permissions) {
                  if (user.permissions.read) {
                    if (user.lastLogin) {
                      if (Date.now() - user.lastLogin < 86400000) {
                        return { status: 'active', canRead: true };
                      }
                    }
                  }
                }
              }
            }
            return { status: 'inactive', canRead: false };
          }
        `,
        good: `
          function processUser(user) {
            if (!user?.active) {
              return { status: 'inactive', canRead: false };
            }
            
            const canRead = user.permissions?.read || false;
            const isRecentLogin = user.lastLogin && 
              (Date.now() - user.lastLogin < 86400000);
            
            return {
              status: isRecentLogin ? 'active' : 'inactive',
              canRead
            };
          }
        `
      },
      
      // 4. Inconsistência de formatação
      inconsistentFormatting: {
        bad: `
          const users=[{name:'João',age:30},{name:'Maria',age:25}];
          function getAdults(users){
          return users.filter(user=>user.age>=18).map(user=>{
          return{...user,isAdult:true};
          });
          }
        `,
        good: `
          const users = [
            { name: 'João', age: 30 },
            { name: 'Maria', age: 25 }
          ];
          
          function getAdults(users) {
            return users
              .filter(user => user.age >= 18)
              .map(user => ({
                ...user,
                isAdult: true
              }));
          }
        `
      }
    };
    
    console.log('Exemplos de problemas detectados por linting:', problemExamples);
    return problemExamples;
  }
  
  // Demonstração de benefícios da formatação automática
  static demonstrateFormattingBenefits() {
    const benefits = {
      consistency: {
        description: 'Código consistente em toda a equipe',
        example: {
          before: 'Cada desenvolvedor com estilo próprio',
          after: 'Estilo unificado automaticamente'
        }
      },
      
      productivity: {
        description: 'Menos tempo gasto em discussões de estilo',
        example: {
          before: 'Revisões focadas em formatação',
          after: 'Revisões focadas em lógica e arquitetura'
        }
      },
      
      readability: {
        description: 'Código mais legível e fácil de entender',
        example: {
          before: 'Formatação inconsistente dificulta leitura',
          after: 'Formatação padronizada facilita compreensão'
        }
      },
      
      maintenance: {
        description: 'Facilita manutenção e refatoração',
        example: {
          before: 'Mudanças geram conflitos de formatação',
          after: 'Mudanças focadas apenas no conteúdo'
        }
      }
    };
    
    console.log('Benefícios da formatação automática:', benefits);
    return benefits;
  }
}

// =============================================================================
// 2. ESLINT CONFIGURATION
// =============================================================================

/*
ESLint é a ferramenta padrão para linting em JavaScript/TypeScript,
detectando problemas e aplicando regras de qualidade.
*/

class ESLintConfig {
  // Configuração básica do ESLint
  static getBasicConfig() {
    return {
      env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
      },
      
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      ],
      
      parser: '@typescript-eslint/parser',
      
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      },
      
      plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint',
        'import',
        'jsx-a11y'
      ],
      
      rules: {
        // Regras gerais
        'no-console': 'warn',
        'no-debugger': 'error',
        'no-unused-vars': 'off', // Desabilitado em favor do TypeScript
        '@typescript-eslint/no-unused-vars': 'error',
        
        // Regras de qualidade
        'prefer-const': 'error',
        'no-var': 'error',
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        
        // Regras de complexidade
        'complexity': ['warn', 10],
        'max-depth': ['warn', 4],
        'max-lines-per-function': ['warn', 50],
        
        // Regras React
        'react/prop-types': 'off', // TypeScript já faz essa verificação
        'react/react-in-jsx-scope': 'off', // React 17+
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        
        // Regras de importação
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index'
            ],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true
            }
          }
        ],
        
        // Regras de acessibilidade
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/click-events-have-key-events': 'warn'
      },
      
      settings: {
        react: {
          version: 'detect'
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json'
          }
        }
      }
    };
  }
  
  // Configuração para TypeScript
  static getTypeScriptConfig() {
    return {
      extends: [
        '@typescript-eslint/recommended',
        '@typescript-eslint/recommended-requiring-type-checking'
      ],
      
      parser: '@typescript-eslint/parser',
      
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.'
      },
      
      plugins: ['@typescript-eslint'],
      
      rules: {
        // Regras TypeScript específicas
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        
        // Regras de tipagem
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        
        // Regras de nomenclatura
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'interface',
            format: ['PascalCase'],
            prefix: ['I']
          },
          {
            selector: 'typeAlias',
            format: ['PascalCase']
          },
          {
            selector: 'enum',
            format: ['PascalCase']
          },
          {
            selector: 'enumMember',
            format: ['UPPER_CASE']
          }
        ],
        
        // Regras de performance
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        
        // Regras de segurança
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn'
      }
    };
  }
  
  // Configuração para React
  static getReactConfig() {
    return {
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended'
      ],
      
      plugins: [
        'react',
        'react-hooks',
        'jsx-a11y'
      ],
      
      rules: {
        // Regras React
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'warn',
        
        // Regras JSX
        'react/jsx-key': 'error',
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-pascal-case': 'error',
        
        // Regras de Hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        
        // Regras de performance
        'react/jsx-no-bind': [
          'warn',
          {
            allowArrowFunctions: true,
            allowBind: false,
            ignoreRefs: true
          }
        ],
        
        // Regras de acessibilidade
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/anchor-is-valid': 'error',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/label-has-associated-control': 'error'
      },
      
      settings: {
        react: {
          version: 'detect'
        }
      }
    };
  }
  
  // Configuração customizada para projetos específicos
  static getCustomConfig(projectType) {
    const baseConfig = this.getBasicConfig();
    
    const customConfigs = {
      library: {
        ...baseConfig,
        env: {
          ...baseConfig.env,
          browser: true,
          node: true
        },
        rules: {
          ...baseConfig.rules,
          'no-console': 'error', // Bibliotecas não devem ter console.log
          '@typescript-eslint/explicit-function-return-type': 'error'
        }
      },
      
      backend: {
        ...baseConfig,
        env: {
          node: true,
          es2021: true,
          jest: true
        },
        rules: {
          ...baseConfig.rules,
          'no-console': 'off', // Console é OK no backend
          '@typescript-eslint/no-var-requires': 'off'
        }
      },
      
      strict: {
        ...baseConfig,
        rules: {
          ...baseConfig.rules,
          'no-console': 'error',
          'no-debugger': 'error',
          '@typescript-eslint/no-explicit-any': 'error',
          '@typescript-eslint/explicit-function-return-type': 'error',
          'complexity': ['error', 5],
          'max-lines-per-function': ['error', 30]
        }
      }
    };
    
    return customConfigs[projectType] || baseConfig;
  }
}

// =============================================================================
// 3. PRETTIER CONFIGURATION
// =============================================================================

/*
Prettier é um formatador de código opinativo que garante
consistência visual automática.
*/

class PrettierConfig {
  // Configuração básica do Prettier
  static getBasicConfig() {
    return {
      // Configurações básicas
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      quoteProps: 'as-needed',
      
      // JSX
      jsxSingleQuote: true,
      
      // Trailing commas
      trailingComma: 'es5',
      
      // Espaços
      bracketSpacing: true,
      bracketSameLine: false,
      
      // Arrow functions
      arrowParens: 'avoid',
      
      // Range
      rangeStart: 0,
      rangeEnd: Infinity,
      
      // Parser
      requirePragma: false,
      insertPragma: false,
      
      // Prose wrap
      proseWrap: 'preserve',
      
      // HTML
      htmlWhitespaceSensitivity: 'css',
      
      // Vue
      vueIndentScriptAndStyle: false,
      
      // End of line
      endOfLine: 'lf'
    };
  }
  
  // Configuração para diferentes tipos de arquivo
  static getFileSpecificConfig() {
    return {
      overrides: [
        {
          files: '*.json',
          options: {
            printWidth: 200,
            tabWidth: 2
          }
        },
        {
          files: '*.md',
          options: {
            printWidth: 100,
            proseWrap: 'always'
          }
        },
        {
          files: '*.yml',
          options: {
            tabWidth: 2,
            singleQuote: false
          }
        },
        {
          files: '*.css',
          options: {
            singleQuote: false
          }
        },
        {
          files: '*.scss',
          options: {
            singleQuote: false
          }
        }
      ]
    };
  }
  
  // Configuração para equipes
  static getTeamConfig() {
    return {
      // Configurações mais conservadoras para equipes
      printWidth: 100, // Linha um pouco maior
      tabWidth: 2,
      useTabs: false,
      semi: true, // Sempre usar ponto e vírgula
      singleQuote: true,
      trailingComma: 'all', // Trailing comma em todos os lugares
      bracketSpacing: true,
      arrowParens: 'always', // Sempre parênteses em arrow functions
      endOfLine: 'auto', // Detectar automaticamente
      
      // Ignorar arquivos específicos
      ignore: [
        'dist/**',
        'build/**',
        'coverage/**',
        'node_modules/**',
        '*.min.js',
        '*.bundle.js'
      ]
    };
  }
  
  // Integração com ESLint
  static getESLintIntegration() {
    return {
      // Configuração para eslint-config-prettier
      eslintConfig: {
        extends: [
          'eslint:recommended',
          '@typescript-eslint/recommended',
          'prettier' // Deve ser o último
        ],
        
        plugins: ['prettier'],
        
        rules: {
          'prettier/prettier': 'error'
        }
      },
      
      // Scripts package.json
      scripts: {
        'lint': 'eslint . --ext .js,.jsx,.ts,.tsx',
        'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
        'format': 'prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"',
        'format:check': 'prettier --check "**/*.{js,jsx,ts,tsx,json,css,md}"'
      }
    };
  }
}

// =============================================================================
// 4. HUSKY E GIT HOOKS
// =============================================================================

/*
Husky permite configurar Git hooks para automatizar verificações
antes de commits e pushes.
*/

class HuskyConfig {
  // Configuração básica do Husky
  static getBasicConfig() {
    return {
      // .husky/pre-commit
      preCommit: {
        script: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged`,
        description: 'Executa linting e formatação antes do commit'
      },
      
      // .husky/commit-msg
      commitMsg: {
        script: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit $1`,
        description: 'Valida mensagem de commit'
      },
      
      // .husky/pre-push
      prePush: {
        script: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run test
npm run build`,
        description: 'Executa testes e build antes do push'
      }
    };
  }
  
  // Configuração do lint-staged
  static getLintStagedConfig() {
    return {
      // Configuração básica
      basic: {
        '*.{js,jsx,ts,tsx}': [
          'eslint --fix',
          'prettier --write'
        ],
        '*.{json,css,md}': [
          'prettier --write'
        ]
      },
      
      // Configuração avançada
      advanced: {
        '*.{js,jsx,ts,tsx}': [
          'eslint --fix',
          'prettier --write',
          'git add'
        ],
        '*.{json,css,scss,md}': [
          'prettier --write',
          'git add'
        ],
        '*.{png,jpg,jpeg,gif,svg}': [
          'imagemin-lint-staged'
        ]
      },
      
      // Configuração para monorepo
      monorepo: {
        'packages/*/src/**/*.{js,jsx,ts,tsx}': [
          'eslint --fix',
          'prettier --write'
        ],
        'apps/*/src/**/*.{js,jsx,ts,tsx}': [
          'eslint --fix',
          'prettier --write'
        ],
        '*.{json,md}': [
          'prettier --write'
        ]
      }
    };
  }
  
  // Configuração do commitlint
  static getCommitlintConfig() {
    return {
      extends: ['@commitlint/config-conventional'],
      
      rules: {
        'type-enum': [
          2,
          'always',
          [
            'feat',     // Nova funcionalidade
            'fix',      // Correção de bug
            'docs',     // Documentação
            'style',    // Formatação
            'refactor', // Refatoração
            'test',     // Testes
            'chore',    // Tarefas de build/CI
            'perf',     // Performance
            'ci',       // CI/CD
            'build',    // Build system
            'revert'    // Reverter commit
          ]
        ],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 100],
        'body-leading-blank': [1, 'always'],
        'body-max-line-length': [2, 'always', 100],
        'footer-leading-blank': [1, 'always'],
        'footer-max-line-length': [2, 'always', 100]
      },
      
      // Exemplos de mensagens válidas
      examples: [
        'feat: add user authentication',
        'fix: resolve memory leak in data processing',
        'docs: update API documentation',
        'style: format code with prettier',
        'refactor: extract utility functions',
        'test: add unit tests for user service',
        'chore: update dependencies'
      ]
    };
  }
  
  // Scripts de instalação
  static getInstallationScripts() {
    return {
      // package.json scripts
      scripts: {
        'prepare': 'husky install',
        'husky:install': 'husky install',
        'husky:add-pre-commit': 'husky add .husky/pre-commit "npx lint-staged"',
        'husky:add-commit-msg': 'husky add .husky/commit-msg "npx commitlint --edit $1"',
        'husky:add-pre-push': 'husky add .husky/pre-push "npm run test && npm run build"'
      },
      
      // Comandos de instalação
      installation: [
        'npm install --save-dev husky',
        'npm install --save-dev lint-staged',
        'npm install --save-dev @commitlint/cli @commitlint/config-conventional',
        'npx husky install',
        'npx husky add .husky/pre-commit "npx lint-staged"',
        'npx husky add .husky/commit-msg "npx commitlint --edit $1"'
      ]
    };
  }
}

// =============================================================================
// 5. INTEGRAÇÃO COM EDITORES
// =============================================================================

/*
Configuração de editores para feedback em tempo real
e formatação automática.
*/

class EditorIntegration {
  // Configuração para VS Code
  static getVSCodeConfig() {
    return {
      // .vscode/settings.json
      settings: {
        // ESLint
        'eslint.enable': true,
        'eslint.autoFixOnSave': true,
        'eslint.validate': [
          'javascript',
          'javascriptreact',
          'typescript',
          'typescriptreact'
        ],
        
        // Prettier
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
        'editor.formatOnSave': true,
        'editor.formatOnPaste': true,
        'editor.formatOnType': false,
        
        // Configurações específicas por linguagem
        '[javascript]': {
          'editor.defaultFormatter': 'esbenp.prettier-vscode',
          'editor.formatOnSave': true
        },
        '[typescript]': {
          'editor.defaultFormatter': 'esbenp.prettier-vscode',
          'editor.formatOnSave': true
        },
        '[json]': {
          'editor.defaultFormatter': 'esbenp.prettier-vscode'
        },
        
        // TypeScript
        'typescript.preferences.importModuleSpecifier': 'relative',
        'typescript.suggest.autoImports': true,
        'typescript.updateImportsOnFileMove.enabled': 'always',
        
        // Outras configurações
        'editor.codeActionsOnSave': {
          'source.fixAll.eslint': true,
          'source.organizeImports': true
        },
        'files.eol': '\n',
        'files.insertFinalNewline': true,
        'files.trimTrailingWhitespace': true
      },
      
      // .vscode/extensions.json
      extensions: {
        recommendations: [
          'esbenp.prettier-vscode',
          'dbaeumer.vscode-eslint',
          'ms-vscode.vscode-typescript-next',
          'bradlc.vscode-tailwindcss',
          'ms-vscode.vscode-json'
        ]
      },
      
      // .vscode/tasks.json
      tasks: {
        version: '2.0.0',
        tasks: [
          {
            label: 'lint',
            type: 'npm',
            script: 'lint',
            group: 'build',
            presentation: {
              echo: true,
              reveal: 'always',
              focus: false,
              panel: 'shared'
            },
            problemMatcher: ['$eslint-stylish']
          },
          {
            label: 'format',
            type: 'npm',
            script: 'format',
            group: 'build'
          }
        ]
      }
    };
  }
  
  // Configuração para outros editores
  static getOtherEditorsConfig() {
    return {
      // .editorconfig
      editorconfig: `
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[*.json]
indent_size = 2
      `,
      
      // Vim/Neovim
      vim: {
        plugins: [
          'dense-analysis/ale', // Linting assíncrono
          'prettier/vim-prettier', // Prettier
          'pangloss/vim-javascript', // JavaScript syntax
          'leafgarland/typescript-vim' // TypeScript syntax
        ],
        config: `
" ESLint configuration
let g:ale_linters = {
\  'javascript': ['eslint'],
\  'typescript': ['eslint', 'tsserver'],
\}

" Prettier configuration
let g:prettier#autoformat = 1
let g:prettier#autoformat_require_pragma = 0
        `
      },
      
      // Sublime Text
      sublimeText: {
        packages: [
          'SublimeLinter',
          'SublimeLinter-eslint',
          'JsPrettier',
          'TypeScript'
        ],
        settings: {
          'js_prettier': {
            'auto_format_on_save': true,
            'allow_inline_formatting': true
          }
        }
      }
    };
  }
}

// =============================================================================
// 6. WORKFLOWS DE QUALIDADE
// =============================================================================

/*
Workflows e pipelines para garantir qualidade de código
em diferentes ambientes.
*/

class QualityWorkflows {
  // Workflow para desenvolvimento local
  static getLocalWorkflow() {
    return {
      steps: [
        {
          name: 'Configuração inicial',
          actions: [
            'Instalar dependências de linting',
            'Configurar editor com extensões',
            'Configurar Git hooks'
          ]
        },
        {
          name: 'Durante desenvolvimento',
          actions: [
            'Linting em tempo real no editor',
            'Formatação automática ao salvar',
            'Verificação de tipos TypeScript'
          ]
        },
        {
          name: 'Antes do commit',
          actions: [
            'Lint-staged executa automaticamente',
            'Formatação de arquivos modificados',
            'Validação de mensagem de commit'
          ]
        },
        {
          name: 'Antes do push',
          actions: [
            'Execução de testes',
            'Build de verificação',
            'Análise de qualidade'
          ]
        }
      ],
      
      tools: [
        'ESLint',
        'Prettier',
        'Husky',
        'lint-staged',
        'commitlint'
      ]
    };
  }
  
  // Workflow para CI/CD
  static getCIWorkflow() {
    return {
      // GitHub Actions
      githubActions: {
        name: 'Code Quality',
        on: {
          push: {
            branches: ['main', 'develop']
          },
          pull_request: {
            branches: ['main']
          }
        },
        jobs: {
          quality: {
            'runs-on': 'ubuntu-latest',
            steps: [
              {
                name: 'Checkout code',
                uses: 'actions/checkout@v3'
              },
              {
                name: 'Setup Node.js',
                uses: 'actions/setup-node@v3',
                with: {
                  'node-version': '18',
                  cache: 'npm'
                }
              },
              {
                name: 'Install dependencies',
                run: 'npm ci'
              },
              {
                name: 'Run linting',
                run: 'npm run lint'
              },
              {
                name: 'Check formatting',
                run: 'npm run format:check'
              },
              {
                name: 'Type checking',
                run: 'npm run type-check'
              },
              {
                name: 'Run tests',
                run: 'npm run test'
              },
              {
                name: 'Build project',
                run: 'npm run build'
              }
            ]
          }
        }
      },
      
      // GitLab CI
      gitlabCI: {
        stages: ['quality', 'test', 'build'],
        
        'code-quality': {
          stage: 'quality',
          image: 'node:18',
          script: [
            'npm ci',
            'npm run lint',
            'npm run format:check',
            'npm run type-check'
          ],
          artifacts: {
            reports: {
              junit: 'reports/eslint-report.xml'
            }
          }
        }
      }
    };
  }
  
  // Métricas de qualidade
  static getQualityMetrics() {
    return {
      // Métricas de linting
      linting: {
        errorCount: 0,
        warningCount: 5,
        fixableCount: 3,
        coverage: '95%'
      },
      
      // Métricas de formatação
      formatting: {
        filesFormatted: 150,
        filesTotal: 150,
        compliance: '100%'
      },
      
      // Métricas de commits
      commits: {
        conventionalCommits: '98%',
        averageMessageLength: 65,
        branchingStrategy: 'GitFlow'
      },
      
      // Métricas de código
      code: {
        complexity: 'Low',
        maintainabilityIndex: 85,
        technicalDebt: '2 hours',
        duplicatedLines: '1.2%'
      },
      
      // Tools para métricas
      tools: [
        'SonarQube',
        'CodeClimate',
        'ESLint reports',
        'Prettier stats',
        'Git analytics'
      ]
    };
  }
}

// =============================================================================
// 7. APLICAÇÃO DE DEMONSTRAÇÃO
// =============================================================================

/*
Aplicação que demonstra configuração completa de linting,
formatação e qualidade de código.
*/

class LintingFormattingDemo {
  constructor() {
    this.eslintConfig = new ESLintConfig();
    this.prettierConfig = new PrettierConfig();
    this.huskyConfig = new HuskyConfig();
    this.editorIntegration = new EditorIntegration();
    this.qualityWorkflows = new QualityWorkflows();
  }
  
  // Configuração completa do projeto
  setupProject(projectType = 'react-typescript') {
    const configs = {
      // ESLint configuration
      eslint: this.eslintConfig.getCustomConfig(projectType),
      
      // Prettier configuration
      prettier: this.prettierConfig.getTeamConfig(),
      
      // Husky configuration
      husky: this.huskyConfig.getBasicConfig(),
      
      // lint-staged configuration
      lintStaged: this.huskyConfig.getLintStagedConfig().advanced,
      
      // commitlint configuration
      commitlint: this.huskyConfig.getCommitlintConfig(),
      
      // VS Code configuration
      vscode: this.editorIntegration.getVSCodeConfig(),
      
      // Package.json scripts
      scripts: {
        'lint': 'eslint . --ext .js,.jsx,.ts,.tsx',
        'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
        'format': 'prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"',
        'format:check': 'prettier --check "**/*.{js,jsx,ts,tsx,json,css,md}"',
        'type-check': 'tsc --noEmit',
        'quality': 'npm run lint && npm run format:check && npm run type-check',
        'prepare': 'husky install'
      }
    };
    
    console.log('Configuração completa do projeto:', configs);
    return configs;
  }
  
  // Demonstração de problemas e correções
  demonstrateIssuesAndFixes() {
    const examples = CodeQualityConcepts.demonstrateLintingIssues();
    
    // Simulação de execução do ESLint
    const lintResults = {
      files: [
        {
          filePath: '/src/components/UserCard.tsx',
          messages: [
            {
              ruleId: 'no-unused-vars',
              severity: 2,
              message: "'unusedVariable' is defined but never used.",
              line: 5,
              column: 9
            },
            {
              ruleId: 'eqeqeq',
              severity: 2,
              message: 'Expected === and instead saw ==.',
              line: 12,
              column: 15
            }
          ],
          errorCount: 2,
          warningCount: 0,
          fixableErrorCount: 1,
          fixableWarningCount: 0
        }
      ],
      errorCount: 2,
      warningCount: 0,
      fixableErrorCount: 1,
      fixableWarningCount: 0
    };
    
    // Simulação de formatação do Prettier
    const prettierResults = {
      filesChanged: [
        '/src/components/UserCard.tsx',
        '/src/utils/helpers.ts',
        '/src/styles/global.css'
      ],
      totalFiles: 3,
      timeElapsed: '0.5s'
    };
    
    console.log('Resultados do linting:', lintResults);
    console.log('Resultados da formatação:', prettierResults);
    
    return { lintResults, prettierResults, examples };
  }
  
  // Simulação de workflow completo
  simulateWorkflow() {
    const workflow = {
      steps: [
        {
          name: 'Developer writes code',
          status: 'completed',
          duration: '30min'
        },
        {
          name: 'Editor shows linting errors',
          status: 'completed',
          issues: 3,
          autoFixed: 2
        },
        {
          name: 'Developer fixes remaining issues',
          status: 'completed',
          duration: '2min'
        },
        {
          name: 'Auto-format on save',
          status: 'completed',
          filesFormatted: 1
        },
        {
          name: 'Git commit attempt',
          status: 'completed',
          preCommitHook: 'passed'
        },
        {
          name: 'lint-staged execution',
          status: 'completed',
          filesProcessed: 3,
          issuesFixed: 1
        },
        {
          name: 'Commit message validation',
          status: 'completed',
          format: 'conventional'
        },
        {
          name: 'Commit successful',
          status: 'completed',
          hash: 'abc123f'
        }
      ],
      
      summary: {
        totalTime: '35min',
        issuesFound: 3,
        issuesAutoFixed: 3,
        manualFixes: 0,
        qualityScore: 'A+'
      }
    };
    
    console.log('Simulação de workflow completo:', workflow);
    return workflow;
  }
  
  // Análise de qualidade do projeto
  analyzeProjectQuality() {
    const analysis = {
      codeQuality: {
        lintingScore: 95,
        formattingCompliance: 100,
        typeScriptCoverage: 98,
        complexityScore: 85
      },
      
      processQuality: {
        gitHooksConfigured: true,
        ciPipelineSetup: true,
        editorIntegration: true,
        teamStandards: true
      },
      
      metrics: {
        averageLintErrors: 0.2,
        formattingViolations: 0,
        commitMessageCompliance: 98,
        codeReviewEfficiency: 85
      },
      
      recommendations: [
        'Configurar SonarQube para análise avançada',
        'Implementar métricas de complexidade ciclomática',
        'Adicionar verificação de dependências vulneráveis',
        'Configurar análise de performance de bundle'
      ]
    };
    
    console.log('Análise de qualidade do projeto:', analysis);
    return analysis;
  }
}

// =============================================================================
// 8. DEMONSTRAÇÃO E TESTES
// =============================================================================

function demonstrateLintingFormatting() {
  console.log('\n=== DEMONSTRAÇÃO LINTING E FORMATAÇÃO ===\n');
  
  // 1. Conceitos de qualidade
  console.log('1. CONCEITOS DE QUALIDADE:');
  CodeQualityConcepts.demonstrateLintingIssues();
  CodeQualityConcepts.demonstrateFormattingBenefits();
  
  // 2. Configurações
  console.log('\n2. CONFIGURAÇÕES:');
  const eslintConfig = ESLintConfig.getBasicConfig();
  const prettierConfig = PrettierConfig.getBasicConfig();
  
  console.log('ESLint básico:', JSON.stringify(eslintConfig, null, 2));
  console.log('\nPrettier básico:', JSON.stringify(prettierConfig, null, 2));
  
  // 3. Demonstração da aplicação
  console.log('\n3. APLICAÇÃO DE DEMONSTRAÇÃO:');
  const demo = new LintingFormattingDemo();
  
  // Setup do projeto
  const projectSetup = demo.setupProject('react-typescript');
  console.log('Setup do projeto:', projectSetup);
  
  // Demonstração de problemas e correções
  const issuesDemo = demo.demonstrateIssuesAndFixes();
  console.log('\nDemonstração de problemas:', issuesDemo);
  
  // Simulação de workflow
  const workflowDemo = demo.simulateWorkflow();
  console.log('\nWorkflow simulado:', workflowDemo);
  
  // Análise de qualidade
  const qualityAnalysis = demo.analyzeProjectQuality();
  console.log('\nAnálise de qualidade:', qualityAnalysis);
  
  // 4. Workflows
  console.log('\n4. WORKFLOWS:');
  const workflows = new QualityWorkflows();
  const localWorkflow = workflows.getLocalWorkflow();
  const ciWorkflow = workflows.getCIWorkflow();
  
  console.log('Workflow local:', localWorkflow);
  console.log('\nWorkflow CI/CD:', ciWorkflow);
}

// Executar demonstração
if (typeof window === 'undefined') {
  // Node.js environment
  demonstrateLintingFormatting();
} else {
  // Browser environment
  console.log('Linting and Formatting module loaded. Call demonstrateLintingFormatting() to run demo.');
}

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CodeQualityConcepts,
    ESLintConfig,
    PrettierConfig,
    HuskyConfig,
    EditorIntegration,
    QualityWorkflows,
    LintingFormattingDemo,
    demonstrateLintingFormatting
  };
}

/*
=============================================================================
                              RESUMO DO MÓDULO
=============================================================================

📚 CONCEITOS PRINCIPAIS:

1. **Linting**:
   - Análise estática de código
   - Detecção de problemas e bugs
   - Aplicação de regras de qualidade
   - Integração com editores

2. **Formatação**:
   - Padronização visual automática
   - Consistência em equipes
   - Redução de conflitos de merge
   - Foco na lógica vs. estilo

3. **Git Hooks**:
   - Automação de verificações
   - Prevenção de commits problemáticos
   - Validação de mensagens
   - Execução de testes

4. **Integração de Ferramentas**:
   - ESLint + Prettier + TypeScript
   - Husky + lint-staged + commitlint
   - Editor extensions e configurações
   - CI/CD pipelines

🎯 OBJETIVOS ALCANÇADOS:

✅ Configuração completa de linting
✅ Formatação automática de código
✅ Git hooks para qualidade
✅ Integração com editores
✅ Workflows de CI/CD
✅ Métricas de qualidade

🔧 HABILIDADES DESENVOLVIDAS:

- Configuração de ESLint e Prettier
- Setup de Git hooks com Husky
- Integração com editores
- Criação de workflows de qualidade
- Análise de métricas de código
- Automação de verificações

📈 PRÓXIMOS PASSOS:

1. **Testes Automatizados**: Unit, integration, E2E
2. **Análise de Segurança**: Vulnerability scanning
3. **Performance Monitoring**: Bundle analysis, metrics
4. **Documentation**: Automated docs generation
5. **Deployment**: Automated deployment pipelines

💡 DICAS IMPORTANTES:

- Configure linting desde o início do projeto
- Use formatação automática para evitar discussões
- Implemente Git hooks para prevenir problemas
- Integre com editores para feedback imediato
- Configure CI/CD para verificação contínua
- Monitore métricas de qualidade regularmente
- Mantenha configurações atualizadas
- Documente padrões da equipe

=============================================================================
*/